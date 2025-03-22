import dotenv from 'dotenv';
dotenv.config();

import { initCache } from './services/Cache';
import { server, startHttpServer } from './server/httpServer';

initCache();

const httpServer = startHttpServer();