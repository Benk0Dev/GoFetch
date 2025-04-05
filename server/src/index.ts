import 'module-alias/register';
import dotenv from 'dotenv';
import cron from 'node-cron';
dotenv.config();

import { initCache } from '@server/utils/Cache';
import { startHttpServer } from '@server/server/httpServer';
import { updateBookingStatusWithTimeChange } from './static/BookingStatic';

initCache();

startHttpServer();

// Checks if bookings have started every  minute
cron.schedule('* * * * *', async () => {
    updateBookingStatusWithTimeChange();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    process.exit();
});