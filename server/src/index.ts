import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import { initCache } from '@server/utils/Cache';
import { startHttpServer } from '@server/server/httpServer';

initCache();

startHttpServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    process.exit();
});