import { IPet } from '../models/IPet';
import { cache } from './DbCache';

// Get cached pets
export function getCachedPets(): IPet[] {
    return cache.pets;
}