import { IService } from '../models/IService';
import { cache, DB_PATH } from './Cache';
import fs from 'fs';

// Get cached services
export function getCachedServices(): IService[] {
    return cache.services;
}

export function addServiceCached(service: IService) {
    
    const newService: IService = {
        id: cache.services.length + 1,
        type: service.type,
        duration: service.duration,
        price: service.price,
    };

    cache.services.push(newService);

    saveServicesToFile(cache.services);

    return { success: true, message: 'Service added successfully!' };
}

export function removeServiceCached(id: number) {
    const index = cache.services.findIndex(service => service.id === id);
    if (index === -1) {
        return { success: false, message: 'Service not found!' };
    }
    cache.services.splice(index, 1);
    return { success: true, message: 'Service removed successfully!' };
}

function saveServicesToFile(services: IService[]) {
    fs.writeFileSync(`${DB_PATH}/services.json`, JSON.stringify(services, null, 2), 'utf8');
}