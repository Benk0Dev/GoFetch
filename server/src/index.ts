// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { AllUsersData } from './router/UserStatic';

const app: Express = express();
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/users', (req: Request, res: Response) => {
    res.send(AllUsersData());
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});