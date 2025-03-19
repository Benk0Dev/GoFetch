// src/index.ts
import express from 'express';
import cors from 'cors';
import minderRoutes from './routers/minderRoutes';
import dotenv from 'dotenv';
dotenv.config();

import { initCache } from './services/DbCache';
import { server, startHttpServer } from './server/httpServer';
import { startWsServer } from './server/wsServer';

const app = express();
app.use(cors());

// ✅ Route for /api/minders
app.use("/api", minderRoutes);

// ✅ Listen on PORT 3000 and log the correct port
app.listen(3000, () => console.log("Server running on port 3000"));

// ✅ Initialize database cache when app starts
initCache();

// ✅ Start HTTP server (if needed for websockets or separate APIs)
const httpServer = startHttpServer();
startWsServer(httpServer);
