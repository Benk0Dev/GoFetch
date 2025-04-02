import fs from 'fs';
import { BookingStatus, IBooking, INewBooking } from '@gofetch/models/IBooking';
import { DB_PATH, cache } from '@server/utils/Cache';
import path from 'path';
import { chatWith2UsersCached } from './MessagesCached';
import { addMessage } from '@server/static/MessageStatic';
import { addNotification } from '@server/static/NotificationStatic';
import { NotificationType } from '@gofetch/models/INotification';
import { getIO } from '@server/server/wsServer';

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

export function updateBookingStatusCached(bookingId: number, status: BookingStatus): IBooking | undefined {
  const booking = cache.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date();

    // Save to file
    saveBookingsToFile();

    if (BookingStatus.Confirmed === status) {
      console.log('Booking confirmed:', booking);
      const chatId = chatWith2UsersCached(booking.ownerId, booking.minderId)?.chatId;
      if (!chatId) {
        console.error('Chat not found');
        return booking;
      }

      const messageContent = `Booking #${booking.id} has been accepted!`;

      // Create message object with consistent structure
      const messageObj = {
        senderId: -1, // System message (not from a user)
        message: messageContent,
        chatId: chatId,
        timestamp: new Date()
      };

      // Add message to database
      const result = addMessage(chatId, messageObj);

      if (result.success) {
        const io = getIO();
        if (io) {
          [booking.ownerId, booking.minderId].forEach(userId => {
            const notificationData = {
              userId: userId,
              message: messageContent,
              type: NotificationType.System,
              linkId: booking.id
            };

            addNotification(notificationData);

            io.to(`user-${userId}`).emit('notification', notificationData);
          });
        }
      }
    }
    return booking;
  }
  return undefined; // No booking found with that ID
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

export function saveBookingsToFile() {
  try {
    fs.writeFileSync(path.join(DB_PATH, 'bookings.json'),JSON.stringify(cache.bookings, null, 2),'utf8'
    );
  } catch (error) {
    console.error('Error saving booking data:', error);
  }
}
