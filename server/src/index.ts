// src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import { initCache } from './services/DbCache';
import { startHttpServer } from './server/httpServer';
import { startWsServer } from './server/wsServer';

// Initialize database cache when app starts
initCache();

// Start HTTP server and get server instance
const httpServer = startHttpServer();
startWsServer(httpServer);

// Start websocket server with the HTTP server instance