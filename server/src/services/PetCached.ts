import fs from 'fs';
import { IPet } from '../models/IPet';
import { cache, DB_PATH } from './Cache';

// Get cached pets
export function getCachedPets(): IPet[] {
    try {
        return cache.pets;
    }
    catch (error) {
        return [];
    }
}

export function addPetCached(pet: IPet) {

    const newId = cache.pets.length > 0 ? cache.pets[cache.pets.length - 1].id + 1 + 1 : 1;
    const newPet: IPet = {
        id: newId,
        name: pet.name,
        dob: pet.dob,
        gender: pet.gender,
        breed: pet.breed,
        weight: pet.weight,
        neutered: pet.neutered,
        behaviour: pet.behaviour,
        allergies: pet.allergies || "",
        picture: pet.picture || ""
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