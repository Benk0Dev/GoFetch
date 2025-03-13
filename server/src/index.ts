// src/index.ts
import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import IUser from './model/IUser';
import IPet from './model/IPet';

const app: Express = express();
const port = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, '/db');

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/users', (req: Request, res: Response) => {
    const usersFileContent = fs.readFileSync(path.join(DB_PATH, 'users.json'), 'utf8');
    const usersData = JSON.parse(usersFileContent);
    const users = usersData.users as IUser[];

    const petsFileContent = fs.readFileSync(path.join(DB_PATH, 'pets.json'), 'utf8');
    const petsData = JSON.parse(petsFileContent);
    const pets = petsData.pets as IPet[];

    users.forEach(user => {
        const userPets = pets.filter(pet => pet.ownerId === user.id);
        user.pets = userPets;
    });

    res.send(users);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});