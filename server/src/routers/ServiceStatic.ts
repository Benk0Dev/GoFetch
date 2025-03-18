import { getCachedServices } from '../services/ServiceCached';

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
    return removeService(id);
}