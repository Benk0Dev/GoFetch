import {
    IBooking,
    BookingStatus,
    INewBooking
} from '@gofetch/models/IBooking';
import {
    getAllBookingsCached,
    getBookingByIdCached,
    getBookingsForUserCached,
    getBookingsForPetCached,
    getBookingsForMindeCached,
    addBookingCached,
    updateBookingStatusCached,
    updateBookingDetailsCached,
    deleteBookingCached
} from '@server/services/BookingCached';
import { addNotification } from './NotificationStatic';
import { getUserByID } from './UserStatic';
import { NotificationType } from '@gofetch/models/INotification';
import { getCachedPayments } from '@server/services/PaymentCached';

export function getAllBookings() {
    const bookings = getAllBookingsCached();
    return {
        success: true,
        bookings
    };
}

export function getBookingById(id: number) {
    const booking = getBookingByIdCached(id);
    if (!booking) {
        return { success: false, message: `Booking with ID ${id} not found` };
    }
    return { success: true, booking };
}

export function getBookingsForUser(userId: number) {
    const bookings = getBookingsForUserCached(userId);
    return { success: true, bookings };
}

export function getBookingsForPet(petId: number) {
    const bookings = getBookingsForPetCached(petId);
    return { success: true, bookings };
}

export function getBookingsForMinder(minderId: number) {
    const bookings = getBookingsForMindeCached(minderId);
    return { success: true, bookings };
}

export function createBooking(bookingData: INewBooking) {
    try {
        const booking = addBookingCached(bookingData);
        return { success: true, booking };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'Failed to create booking' };
    }
}

export function updateBookingStatus(bookingId: number, status: BookingStatus) {
    const booking = updateBookingStatusCached(bookingId, status);
    if (!booking) {
        return { success: false, message: `Booking with ID ${bookingId} not found` };
    }
    return { success: true, booking };
}

export function updateBookingDetails(
    bookingId: number,
    updates: Partial<Omit<IBooking, 'id' | 'createdAt' | 'updatedAt'>>
) {
    const booking = updateBookingDetailsCached(bookingId, updates);
    if (!booking) {
        return { success: false, message: `Booking with ID ${bookingId} not found` };
    }
    return { success: true, booking };
}

export function deleteBooking(bookingId: number) {
    const success = deleteBookingCached(bookingId);
    if (!success) {
        return { success: false, message: `Booking with ID ${bookingId} not found` };
    }
    return { success: true, message: `Booking with ID ${bookingId} deleted successfully` };
}

export function updateBookingStatusWithTimeChange() {
    const bookings = getAllBookingsCached();
    const now = new Date();

    bookings.forEach((booking) => {
        if (booking.status === BookingStatus.Confirmed && new Date(booking.time) < now) {
            updateBookingStatus(booking.id, BookingStatus.InProgress);
            addNotification({
                userId: booking.ownerId,
                message: `Booking #${booking.id} is now in progress.`,
                type: NotificationType.Booking,
                linkId: booking.id
            })
            addNotification({
                userId: booking.minderId,
                message: `Booking #${booking.id} is now in progress.`,
                type: NotificationType.Booking,
                linkId: booking.id
            });
        }
    });

    bookings.forEach((booking) => {
        if (booking.status === BookingStatus.Pending && new Date(booking.time) < now) {
            updateBookingStatus(booking.id, BookingStatus.Rejected);
            const payment = getCachedPayments().find((p) => p.id === booking.paymentId);
            addNotification({
                userId: booking.ownerId,
                message: `Booking request #${booking.id} has expired. You have received a refund £${payment ? payment.amount : ""}.`,
                type: NotificationType.Booking,
                linkId: booking.id
            });
            addNotification({
                userId: booking.minderId,
                message: `Booking request #${booking.id} has expired`,
                type: NotificationType.Booking,
                linkId: booking.id
            });
        }
    });
}