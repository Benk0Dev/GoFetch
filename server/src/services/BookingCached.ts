import fs from 'fs';
import { BookingStatus, IBooking, INewBooking } from '../models/IBooking';
import { DB_PATH, cache } from './Cache';
import path from 'path';

// Get all bookings
export function getAllBookingsCached(): IBooking[] {
  return cache.bookings;
}

export function getBookingByIdCached(bookingId: number): IBooking | null {
  const booking = cache.bookings.find(b => b.id === bookingId);
  return booking || null;
}

export function getBookingsForUserCached(userId: number): IBooking[] {
  // Return bookings where user is either the owner or the minder
  return cache.bookings.filter(b => b.ownerId === userId || b.minderId === userId);
}

export function getBookingsForPetCached(petId: number): IBooking[] {
  return cache.bookings.filter(b => b.petId === petId);
}

export function getBookingsForMindeCached(minderId: number): IBooking[] {
  return cache.bookings.filter(b => b.minderId === minderId);
}

export function addBookingCached(bookingData: INewBooking): IBooking {

  const now = new Date();
  const newId = cache.bookings.length > 0 ? cache.bookings[cache.bookings.length - 1].id + 1 : 1;
  const newBooking: IBooking = {
    id: newId,
    ...bookingData,
    status: BookingStatus.Pending,
    createdAt: now,
    updatedAt: now
  };

  // Add to bookings array
  cache.bookings.push(newBooking);

  // Save to file
  saveBookingsToFile();

  return newBooking;
}

export function updateBookingStatusCached(bookingId: number, status: BookingStatus): IBooking | null {
  const booking = cache.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date();

    // Save to file
    saveBookingsToFile();

    return booking;
  }
  return null;
}

export function updateBookingDetailsCached(
  bookingId: number,
  updates: Partial<Omit<IBooking, 'id' | 'createdAt' | 'updatedAt'>>
): IBooking | null {
  const booking = cache.bookings.find(b => b.id === bookingId);
  if (booking) {
    // Update all provided fields
    Object.assign(booking, updates);

    // Always update the updatedAt timestamp
    booking.updatedAt = new Date();

    // Save to file
    saveBookingsToFile();

    return booking;
  }
  return null;
}

export function deleteBookingCached(bookingId: number): boolean {
  const initialLength = cache.bookings.length;
  cache.bookings = cache.bookings.filter(b => b.id !== bookingId);

  if (initialLength !== cache.bookings.length) {
    // Save to file
    saveBookingsToFile();
    return true;
  }
  return false;
}

function saveBookingsToFile() {
  try {
    fs.writeFileSync(path.join(DB_PATH, 'bookings.json'),JSON.stringify(cache.bookings, null, 2),'utf8'
    );
  } catch (error) {
    console.error('Error saving booking data:', error);
  }
}
