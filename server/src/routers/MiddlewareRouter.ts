import { Router, Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import { log } from '@server/utils/utils';

const router = Router();

// Important CORS setup for Express
router.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Add all your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Logging middleware
router.use((req: Request, res: Response, next) => {
  log(req.url, req);
  next();
});

// Middleware to strip /v1 prefix from API routes
router.use((req: Request, res: Response, next) => {
  if (req.url.startsWith('/v1')) {
    req.url = req.url.replace('/v1', '');
  }
  next();
});

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

export default router;