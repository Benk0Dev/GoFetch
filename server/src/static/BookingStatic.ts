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
            const owner = getUserByID(booking.ownerId).user;
            const minder = getUserByID(booking.minderId).user;
            addNotification({
                userId: booking.ownerId,
                message: `Your booking with ${minder?.name.fname} ${minder?.name.sname} is now in progress.`,
                type: NotificationType.BookingInProgress,
                linkId: booking.id
            })
            addNotification({
                userId: booking.minderId,
                message: `Your booking with ${owner?.name.fname} ${owner?.name.sname} is now in progress.`,
                type: NotificationType.BookingInProgress,
                linkId: booking.id
            });
        }
    });

    bookings.forEach((booking) => {
        if (booking.status === BookingStatus.Pending && new Date(booking.time) < now) {
            updateBookingStatus(booking.id, BookingStatus.Rejected);
            const owner = getUserByID(booking.ownerId).user;
            const minder = getUserByID(booking.minderId).user;
            addNotification({
                userId: booking.ownerId,
                message: `Your booking request with ${minder?.name.fname} ${minder?.name.sname} has expired`,
                type: NotificationType.BookingExpired,
                linkId: booking.id
            });
            addNotification({
                userId: booking.minderId,
                message: `Your booking request from ${owner?.name.fname} ${owner?.name.sname} has expired`,
                type: NotificationType.BookingExpired,
                linkId: booking.id
            });
        }
    });
}