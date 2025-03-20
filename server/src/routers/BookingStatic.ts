import { getBookingsForUserCached, getAllBookingsCached } from '../services/BookingCached';

export function getBookingsForUser(id: number) {
    return { success: true, message: getBookingsForUserCached(id)};
}

export function getAllBookings() {
    return { success: true, message: getAllBookingsCached()};
}