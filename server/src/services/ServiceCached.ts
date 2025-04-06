import { IService } from '@gofetch/models/IService';
import { saveUsersToFile } from '@server/services/UserCached';
import { cache, DB_PATH } from '@server/utils/Cache';
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
    const userIndex = cache.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    else {
        cache.users[userIndex].minderRoleInfo.serviceIds.push(newService.id);
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

    // Remove the service ID from users who have it
    cache.users.forEach(user => {
        const serviceIndex = user.minderRoleInfo.serviceIds.indexOf(id);
        if (serviceIndex !== -1) {
            user.minderRoleInfo.serviceIds.splice(serviceIndex, 1);
        }
    });

    // Save the updated users
    saveUsersToFile(cache.users);

    // Save the updated services
    try {
        saveServicesToFile(cache.services);
        return { success: true, message: 'Service removed successfully!' };
    } catch (error) {
        console.error('Error saving services file:', error);
        return { success: false, message: 'Error removing service' };
    }
}

export function saveServicesToFile(services: IService[]) {
    try {
        fs.writeFileSync(`${DB_PATH}/services.json`, JSON.stringify(services, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving services file:', error);
    }
}