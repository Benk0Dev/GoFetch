import dotenv from 'dotenv';
dotenv.config();

// Register module aliases
import 'module-alias/register';
import path from 'path';
import moduleAlias from 'module-alias';

// Add path aliases
moduleAlias.addAliases({
    '@server': path.join(__dirname),
    '@gofetch': path.join(__dirname, '../../shared/src/')
});

import { initCache } from '@server/services/Cache';
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