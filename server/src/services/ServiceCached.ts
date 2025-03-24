import { IService } from '../models/IService';
import { saveUsersToFile } from './UserCached';
import { cache, DB_PATH } from './Cache';
import fs from 'fs';

// Get cached services
export function getCachedServices(): IService[] {
    try {
        return cache.services;
    }
    catch (error) {
        return [];
    }
}

export function addServiceCached(id: number, service: IService) {

    const newId = cache.services.length > 0 ? cache.services[cache.services.length - 1].id + 1 : 1;
    const newService: IService = {
        id: newId,
        type: service.type,
        duration: service.duration,
        price: service.price,
    };

    cache.services.push(newService);

    saveServicesToFile(cache.services);

    // Add the service to the user
    const userIndex = cache.users.findIndex(user => user.userDetails.id === id);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    else {
        if (!cache.users[userIndex].minderRoleInfo) {
            cache.users[userIndex].minderRoleInfo = {
                serviceIDs: [],
                rating: 0,
                bio: '',
                pictures: [],
                availability: '',
                distanceRange: 0,
                verified: false,
                bookingIDs: []
            };
        }

        cache.users[userIndex].minderRoleInfo.serviceIDs.push(newService.id);

        saveUsersToFile(cache.users);
    }

    return { success: true, message: 'Service added successfully!', service: newService };
}

export function removeServiceCached(id: number) {
    const index = cache.services.findIndex(service => service.id === id);
    if (index === -1) {
        return { success: false, message: 'Service not found!' };
    }

    cache.services.splice(index, 1);

    // Save the updated services
    try {
        saveServicesToFile(cache.services);
        return { success: true, message: 'Service removed successfully!' };
    } catch (error) {
        console.error('Error saving services file:', error);
        return { success: false, message: 'Error removing service' };
    }
}

function saveServicesToFile(services: IService[]) {
    try {
        fs.writeFileSync(`${DB_PATH}/services.json`, JSON.stringify(services, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving services file:', error);
    }
}