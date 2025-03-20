import fs from 'fs';
import { EBookingStatus, IBooking } from '../models/IBooking';
import { DB_PATH, cache } from './Cache';

// Get all bookings
export function getAllBookingsCached(): IBooking[] {
  try {
    return cache.booking;
  }
  catch (error) {
    return [];
  }
}

// Get bookings for a specific user (either as owner or minder)
export function getBookingsForUserCached(userId: number): IBooking[] {
  const bookings = cache.booking
  return bookings.filter(booking => 
    booking.ownerId === userId || booking.minderId === userId
  );
}

// Add a new booking
export function addBookingCached(booking: IBooking): { success: boolean; message: string; booking?: IBooking } {
  try {
    const bookings = cache.booking;
    
    // Create new booking with ID
    const newBooking: IBooking = {
      ...booking,
      id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
    };
    
    bookings.push(newBooking);
    
    // Save to file
    saveBookingsToFile(bookings);
    
    return { success: true, message: 'Booking created successfully', booking: newBooking };
  } catch (error) {
    console.error('Error adding booking:', error);
    return { success: false, message: 'Failed to create booking' };
  }
}

// Update booking status
export function updateBookingStatusCached(
  bookingId: number, 
  newStatus: EBookingStatus
): { success: boolean; message: string } {
  try {
    const bookings = cache.booking;
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return { success: false, message: 'Booking not found' };
    }
    
    bookings[bookingIndex].status = newStatus;
    
    // Save to file
    saveBookingsToFile(bookings);
    
    return { success: true, message: `Booking status updated to ${newStatus}` };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, message: 'Failed to update booking status' };
  }
}

function saveBookingsToFile(bookings: IBooking[]) {
  fs.writeFileSync(`${DB_PATH}/booking.json`, JSON.stringify(bookings, null, 2), 'utf8');
}