import { getCachedPets } from '../services/PetCached';

export function AllPets() {
    return getCachedPets();
}

export function PetByID(id: number) {
    return getCachedPets().find(pet => pet.id === id);
}