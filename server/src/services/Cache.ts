import fs from 'fs';
import path from 'path';
import { IUser } from '../models/IUser';
import { IPet } from '../models/IPet';
import { IService } from '../models/IService';
import { IBooking } from '../models/IBooking';
import { IMessage, IChat } from '../models/IMessage';
import { INotification } from '../models/INotification';

// DB path
export const DB_PATH = path.join(__dirname, './../db');

// Cache structure
export interface DbCache {
  users: IUser[];
  pets: IPet[];
  services: IService[];
  bookings: IBooking[];
  messages: IMessage[];
  chats: IChat[];
  notifications: INotification[];
}

// Initialize empty cache
export const cache: DbCache = {
  users: [],
  pets: [],
  services: [],
  bookings: [],
  messages: [],
  chats: [],
  notifications: [],
};

// Initialize cache by loading data from files
export function initCache(): void {
  console.log('Initializing database cache...');
  try {
    const usersData = fs.readFileSync(`${DB_PATH}/users.json`, 'utf8');
    const petsData = fs.readFileSync(`${DB_PATH}/pets.json`, 'utf8');
    const servicesData = fs.readFileSync(`${DB_PATH}/services.json`, 'utf8');
    const bookingData = fs.readFileSync(`${DB_PATH}/bookings.json`, 'utf8');
    const messagesData = fs.readFileSync(`${DB_PATH}/messages.json`, 'utf8');
    const notificationsData = fs.readFileSync(`${DB_PATH}/notifications.json`, 'utf8');

    cache.users = JSON.parse(usersData);
    cache.pets = JSON.parse(petsData);
    cache.services = JSON.parse(servicesData);
    cache.bookings = JSON.parse(bookingData);
    cache.notifications = JSON.parse(notificationsData);
    const parsedMessagesData = JSON.parse(messagesData);
    cache.messages = parsedMessagesData.messages;
    cache.chats = parsedMessagesData.chats;

    console.log('Database cache initialized successfully');
  } catch (error) {
    console.error('Error initializing database cache:', error);
    process.exit(1);
  }
}

// Function to refresh the cache (useful for when data changes)
export function refreshCache(): void {
  initCache();
}