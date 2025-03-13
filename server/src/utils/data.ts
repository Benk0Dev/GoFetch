import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, './../db');

export function getUsersData() {
    return fs.readFileSync(`${DB_PATH}/users.json`, 'utf8');
}

export function getPetsData() {
    return fs.readFileSync(`${DB_PATH}/pets.json`, 'utf8');
}