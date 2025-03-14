// src/index.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { AllUsersData, UserData, RegisterUser } from './router/UserStatic';
import { log } from './utils/utils';
import { initCache } from './utils/DbCache';

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database cache when app starts
initCache();

// Logging middleware
app.get('*', (req: Request, res: Response, next) => {
  log(req.url, req);
  next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/users', (req: Request, res: Response) => {
  res.send(AllUsersData());
});

app.get('/user/:id', (req: Request, res: Response) => {
  const result = UserData(req.params.id);
  if (result === 'User not found') {
    res.status(404).send({ message: result });
    return;
  }
  res.send(result);
});

app.post('/registerUser', (req: Request, res: Response) => {
  const result = RegisterUser(req.body);
  if (!result.success) {
    res.status(400).send(result);
    return;
  }
  res.status(201).send(result);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});