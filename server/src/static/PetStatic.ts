import { IPet } from '@gofetch/models/IPet';
import { Role } from '@gofetch/models/IUser';
import { addPetCached, getCachedPets, removePetCached } from '@server/services/PetCached';
import { DB_PATH, cache } from '@server/utils/Cache';
import fs from 'fs';

export function AllPets() {
    const result = getCachedPets();
    if (result.length === 0) {
        return { success: false, message: 'No pets found' };
    }
    return { success: true, pets: result };
}

export function PetByID(id: number) {
    const pet = cache.pets.find(pet => pet.id === id);
    if (pet) {
        return { success: true, pet };
    }
    return { success: false, message: 'Pet not found' };
}

export function registerPet(pet: IPet) {
    const result = addPetCached(pet);
    if (!result.success) {
        return { success: false, message: 'Pet not registered' };
    }
    return { success: true, message: 'Pet registered successfully!', pet: result.pet };
}

export function removePet(id: number) {
    return {success: true, message: removePetCached(id)}
}

export function addPetForUser(userId: number, pet: IPet) {
    // Find user in cache
    const userIndex = cache.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    // Check if user is a pet owner
    if (!cache.users[userIndex].roles.includes(Role.OWNER)) {
        return { success: false, message: 'User is not a pet owner' };
    }

    // Create new pet with ID
    const newPet: IPet = {
        id: cache.pets.length + 1,
        name: pet.name,
        dob: pet.dob,
        gender: pet.gender,
        breed: pet.breed,
        size: pet.size,
        neutered: pet.neutered,
        behaviour: pet.behaviour,
        allergies: pet.allergies || "",
        picture: pet.picture || "",
    };

    // Add pet to pets cache
    cache.pets.push(newPet);

    // Add pet ID to user's pet list
    if (!cache.users[userIndex].ownerRoleInfo) {
        cache.users[userIndex].ownerRoleInfo = { petIds: [], bookingIds: [] };
    }
    cache.users[userIndex].ownerRoleInfo.petIds.push(newPet.id);

    // Write updated data to files
    try {
        fs.writeFileSync(`${DB_PATH}/pets.json`, JSON.stringify(cache.pets, null, 2), 'utf8');
        fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2), 'utf8');
        return { success: true, message: 'Pet added successfully', pet: newPet };
    } catch (error) {
        console.error('Error adding pet for user:', error);
        return { success: false, message: 'Error adding pet' };
    }
}

export function removePetFromUser(userId: number, petId: number) {
    // Find user in cache
    const userIndex = cache.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    // Check if user has pet role info
    if (!cache.users[userIndex].ownerRoleInfo) {
        return { success: false, message: 'User has no pets' };
    }

    // Check if pet is associated with user
    const petIndex = cache.users[userIndex].ownerRoleInfo.petIds.indexOf(petId);
    if (petIndex === -1) {
        return { success: false, message: 'Pet not found for this user' };
    }

    // Remove pet from user's list
    cache.users[userIndex].ownerRoleInfo.petIds.splice(petIndex, 1);

    // Write updated data
    try {
        fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2), 'utf8');
        return { success: true, message: 'Pet removed from user successfully' };
    } catch (error) {
        console.error('Error removing pet from user:', error);
        return { success: false, message: 'Error removing pet' };
    }
}