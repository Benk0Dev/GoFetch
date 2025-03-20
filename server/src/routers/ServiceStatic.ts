import { getCachedServices, removeServiceCached } from '../services/ServiceCached';
import { Role } from '../models/IUser';
import { cache, DB_PATH } from '../services/Cache';
import fs from 'fs';

export function AllServices() {
    return getCachedServices();
}

export function ServiceByID(id: number) {
    const service = getCachedServices().find(service => service.id === id);
    if (service) {
        return { success: true, service };
    }
    return { success: false, message: 'Service not found' };
}

export function removeService(id: number) {
    return { success: true, message: removeServiceCached(id)}
}

export function addServiceForUser(userId: number, serviceId: number) {
    // Find user
    const userIndex = cache.users.findIndex(user => user.userDetails.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    // Verify user is a pet minder
    if (!cache.users[userIndex].roles.includes(Role.MINDER)) {
        return { success: false, message: 'User is not a pet minder' };
    }

    // Verify service exists
    const service = cache.services.find(service => service.id === serviceId);
    if (!service) {
        return { success: false, message: 'Service not found' };
    }

    // Initialize minderRoleInfo if not exists
    if (!cache.users[userIndex].minderRoleInfo) {
        cache.users[userIndex].minderRoleInfo = {
            serviceIDs: [],
            rating: 0,
            bio: '',
            pictures: [],
            availability: '',
            distanceRange: 0,
            verified: false
        };
    }

    // Check if service is already added
    if (cache.users[userIndex].minderRoleInfo.serviceIDs.includes(serviceId)) {
        return { success: false, message: 'Service already added for this user' };
    }

    // Add service ID to user's services
    cache.users[userIndex].minderRoleInfo.serviceIDs.push(serviceId);

    // Save changes
    try {
        fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2), 'utf8');
        return { success: true, message: 'Service added for user successfully', service };
    } catch (error) {
        console.error('Error adding service for user:', error);
        return { success: false, message: 'Error adding service' };
    }
}

export function removeServiceFromUser(userId: number, serviceId: number) {
    // Find user
    const userIndex = cache.users.findIndex(user => user.userDetails.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    // Check if user has minder role info with services
    if (!cache.users[userIndex].minderRoleInfo || !cache.users[userIndex].minderRoleInfo.serviceIDs) {
        return { success: false, message: 'User has no services' };
    }

    // Check if service is assigned to user
    const serviceIndex = cache.users[userIndex].minderRoleInfo.serviceIDs.indexOf(serviceId);
    if (serviceIndex === -1) {
        return { success: false, message: 'Service not found for this user' };
    }

    // Remove service from user
    cache.users[userIndex].minderRoleInfo.serviceIDs.splice(serviceIndex, 1);

    // Save changes
    try {
        fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2), 'utf8');
        return { success: true, message: 'Service removed from user successfully' };
    } catch (error) {
        console.error('Error removing service from user:', error);
        return { success: false, message: 'Error removing service' };
    }
}