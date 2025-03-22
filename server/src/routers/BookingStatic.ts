import {
    IBooking,
    EBookingStatus
} from '../models/IBooking';
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
} from '../services/BookingCached';

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

export function createBooking(bookingData: Omit<IBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    try {
        const booking = addBookingCached(bookingData);
        return { success: true, booking };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'Failed to create booking' };
    }
}

export function updateBookingStatus(bookingId: number, status: EBookingStatus) {
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