import { IService } from '../models/IService';
import { cache } from './DbCache';

// Get cached services
export function getCachedServices(): IService[] {
    return cache.services;
}