import { getCachedServices } from '../services/ServiceCached';

export function AllServices() {
    return getCachedServices();
}