import { getCachedPets } from '../services/PetCached';

export function AllPets() {
    return getCachedPets();
}