import { getCachedServices, removeServiceCached, addServiceCached } from '@server/services/ServiceCached';
import { cache, DB_PATH } from '@server/utils/Cache';
import fs from 'fs';

export function AllServices() {
    const result = getCachedServices();
    if (result.length === 0) {
        return { success: false, message: 'No services found' };
    }
    return { success: true, services: result };
}

export function ServiceByID(id: number) {
    const service = cache.services.find(service => service.id === id);
    if (service) {
        return { success: true, service };
    }
    return { success: false, message: 'Service not found' };
}

export function removeService(id: number) {
    return { success: true, message: removeServiceCached(id)}
}

export function addServiceForUser(userId: number, serviceData: any) {
    // Make sure required fields are provided
    if (!serviceData.type || !serviceData.duration || !serviceData.price) {
        return { success: false, message: 'Missing required service information' };
    }

    return addServiceCached(userId, serviceData);
}

export function editService(serviceId: number, serviceData: any) {
    // Find the service
    const serviceIndex = cache.services.findIndex(service => service.id === serviceId);
    if (serviceIndex === -1) {
        return { success: false, message: 'Service not found' };
    }

    // Update service properties
    cache.services[serviceIndex] = {
        ...cache.services[serviceIndex],
        type: serviceData.type || cache.services[serviceIndex].type,
        duration: serviceData.duration || cache.services[serviceIndex].duration,
        price: serviceData.price || cache.services[serviceIndex].price,
    };

    // Save changes
    try {
        fs.writeFileSync(`${DB_PATH}/services.json`, JSON.stringify(cache.services, null, 2), 'utf8');
        return { success: true, message: 'Service updated successfully', service: cache.services[serviceIndex] };
    } catch (error) {
        console.error('Error updating service:', error);
        return { success: false, message: 'Error updating service' };
    }
}