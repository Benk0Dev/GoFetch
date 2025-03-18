import { IPet } from '../models/IPet';
import { getCachedPets, removePetCahce } from '../services/PetCached';

export function AllPets() {
    return getCachedPets();
}

export function PetByID(id: number) {
    return getCachedPets().find(pet => pet.id === id);
}

export function registerPet(pet: IPet) {
    return registerPet(pet);
}

export function removePet(id: number) {
    return removePetCahce(id);
}