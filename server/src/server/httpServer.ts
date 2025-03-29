import express, { Express } from 'express';
import http from 'http';

import { setupWebSocketServer } from '@server/server/wsServer';
import MiddlewareRouter from '@server/routers/MiddlewareRouter';

import BookingRouter from '@server/routers/BookingRouter';
import ImageRouter from '@server/routers/ImageRouter';
import MessageRouter from '@server/routers/MessageRouter';
import NoitificationRouter from '@server/routers/NotificationRouter';
import PetRouter from '@server/routers/PetRouter';
import ReportRouter from '@server/routers/ReportRouter';
import ReviewRouter from '@server/routers/ReviewRouter';
import ServiceRouter from '@server/routers/ServiceRouter';
import UserRouter from '@server/routers/UserRouter';
import PaymentRouter from '@server/routers/PaymentRouter';

const app: Express = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

const routers = [
    MiddlewareRouter,
    BookingRouter,
    ImageRouter,
    MessageRouter,
    NoitificationRouter,
    PetRouter,
    ReportRouter,
    ReviewRouter,
    ServiceRouter,
    UserRouter,
    PaymentRouter,
];

routers.forEach(router => app.use(router));

// Initialize Socket.IO server
const io = setupWebSocketServer(server);

export function startHttpServer() {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Socket.IO server is running`);
    });
    return server;
}

export { app, server, io };