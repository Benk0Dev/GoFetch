import fs from 'fs';
import { EBookingStatus, IBooking } from '../models/IBooking';
import { DB_PATH, cache } from './Cache';
import path from 'path';

// Get all bookings
export function getAllBookingsCached(): IBooking[] {
  return cache.booking;
}

export function getBookingByIdCached(bookingId: number): IBooking | null {
  const booking = cache.booking.find(b => b.id === bookingId);
  return booking || null;
}

export function getBookingsForUserCached(userId: number): IBooking[] {
  // Return bookings where user is either the owner or the minder
  return cache.booking.filter(b => b.ownerId === userId || b.minderId === userId);
}

export function getBookingsForPetCached(petId: number): IBooking[] {
  return cache.booking.filter(b => b.petId === petId);
}

export function getBookingsForMindeCached(minderId: number): IBooking[] {
  return cache.booking.filter(b => b.minderId === minderId);
}

export function addBookingCached(bookingData: Omit<IBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): IBooking {
  // Create new booking with ID
  const newId = cache.booking.length > 0 ? cache.booking[cache.booking.length - 1].id + 1 : 1;
  const now = new Date();
  const newBooking: IBooking = {
    id: newId,
    ...bookingData,
    status: EBookingStatus.Pending,
    createdAt: now,
    updatedAt: now
  };

  // Add to bookings array
  cache.booking.push(newBooking);

  // Save to file
  saveBookingsToFile();

  return newBooking;
}

export function updateBookingStatusCached(bookingId: number, status: EBookingStatus): IBooking | null {
  const booking = cache.booking.find(b => b.id === bookingId);
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
  const booking = cache.booking.find(b => b.id === bookingId);
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
  const initialLength = cache.booking.length;
  cache.booking = cache.booking.filter(b => b.id !== bookingId);

  if (initialLength !== cache.booking.length) {
    // Save to file
    saveBookingsToFile();
    return true;
  }
  return false;
}

function saveBookingsToFile() {
  try {
    fs.writeFileSync(path.join(DB_PATH, 'booking.json'),JSON.stringify(cache.booking, null, 2),'utf8'
    );
  } catch (error) {
    console.error('Error saving booking data:', error);
  }
}
