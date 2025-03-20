import fs from 'fs';
import { IPet } from '../models/IPet';
import { cache, DB_PATH } from './Cache';

// Get cached pets
export function getCachedPets(): IPet[] {
    return cache.pets;
}

export function addPetCached(pet: IPet) {
    
    const newPet: IPet = {
        id: cache.pets.length + 1,
        name: pet.name,
        dob: pet.dob,
        gender: pet.gender,
        breed: pet.breed,
        weight: pet.weight,
        neutered: pet.neutered,
        behaviour: pet.behaviour,
    };

    cache.pets.push(newPet);

    savePetsToFile(cache.pets);

    return { success: true, message: 'Pet registered successfully!' };
}

export function removePetCahce(id: number) {
    const index = cache.pets.findIndex(pet => pet.id === id);
    if (index === -1) {
        return { success: false, message: 'Pet not found!' };
    }
    cache.pets.splice(index, 1);
    return { success: true, message: 'Pet removed successfully!' };
}

function savePetsToFile(pets: IPet[]) {
    fs.writeFileSync(`${DB_PATH}/pets.json`, JSON.stringify(pets, null, 2), 'utf8');
}