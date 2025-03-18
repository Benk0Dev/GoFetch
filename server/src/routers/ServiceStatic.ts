import { getCachedServices } from '../services/ServiceCached';

export function AllServices() {
    return getCachedServices();
}

export function ServiceByID(id: number) {
    return getCachedServices().find(service => service.id === id);
}

export function removeService(id: number) {
    return removeService(id);
}