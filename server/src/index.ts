import dotenv from 'dotenv';
dotenv.config();

import { initCache } from './services/Cache';
import { server, startHttpServer } from './server/httpServer';

initCache();

const httpServer = startHttpServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    process.exit();
});