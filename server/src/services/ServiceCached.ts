import { IService } from '../models/IService';
import { cache } from './DbCache';

// Get cached services
export function getCachedServices(): IService[] {
    return cache.services;
}

export function removeService(id: number) {
    const index = cache.services.findIndex(service => service.id === id);
    if (index === -1) {
        return { success: false, message: 'Service not found!' };
    }
    cache.services.splice(index, 1);
    return { success: true, message: 'Service removed successfully!' };
}