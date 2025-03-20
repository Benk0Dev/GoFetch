import { getBookingsForUserCached, getAllBookingsCached } from '../services/BookingCached';

export function getBookingsForUser(id: number) {
    return { success: true, message: getBookingsForUserCached(id)};
}

export function getAllBookings() {
    const result = getAllBookingsCached();
    if (result.length === 0) {
        return { success: false, message: 'No bookings found' };
    }
    return { success: true, pets: result };
}