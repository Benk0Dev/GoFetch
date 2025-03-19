import fs from 'fs';
import path from 'path';
import { IUser } from '../models/IUser';
import { IPet } from '../models/IPet';
import { IService } from '../models/IService';
import { IBooking } from '../models/IBooking';

// DB path
export const DB_PATH = path.join(__dirname, './../db');

// Cache structure
export interface DbCache {
  users: IUser[];
  pets: IPet[];
  services: IService[]; // Note: typo preserved from original
  booking: IBooking[];
}

// Initialize empty cache
export const cache: DbCache = {
  users: [],
  pets: [],
  services: [],
  booking: []
};

// Initialize cache by loading data from files
export function initCache(): void {
  console.log('Initializing database cache...');
  try {
    const usersData = fs.readFileSync(`${DB_PATH}/users.json`, 'utf8');
    const petsData = fs.readFileSync(`${DB_PATH}/pets.json`, 'utf8');
    const servicesData = fs.readFileSync(`${DB_PATH}/services.json`, 'utf8');

    cache.users = JSON.parse(usersData);
    cache.pets = JSON.parse(petsData);
    cache.services = JSON.parse(servicesData);

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