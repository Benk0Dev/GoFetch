import dotenv from 'dotenv';
dotenv.config();

import { initCache } from './services/Cache';
import { server, startHttpServer } from './server/httpServer';
import { startWsServer } from './server/wsServer';

// Initialize database cache when app starts
initCache();

const httpServer = startHttpServer();
startWsServer(httpServer);