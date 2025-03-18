import { IPet } from '../models/IPet';
import { getCachedPets, removePetCahce } from '../services/PetCached';

export function AllPets() {
    return getCachedPets();
}

export function PetByID(id: number) {
    const pet = getCachedPets().find(pet => pet.id === id);
    if (pet) {
        return { success: true, pet };
    }
    return { success: false, message: 'Pet not found' };
}

export function registerPet(pet: IPet) {
    const result = registerPet(pet);
    if (!result.success) {
        return { success: false, message: 'Pet not registered' };
    }
    return { success: true, message: 'Pet registered successfully!' };
}

export function removePet(id: number) {
    return removePetCahce(id);
}