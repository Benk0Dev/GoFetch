import { Router, Request, Response } from 'express';
import { getBookingsForUser, getAllBookings, getBookingById, getBookingsForPet, getBookingsForMinder, createBooking, updateBookingDetails, updateBookingStatus, deleteBooking } from '@server/static/BookingStatic';

const router = Router();

// Get all bookings
router.get('/bookings', (req: Request, res: Response) => {
    const result = getAllBookings();
    res.json(result);
});

// Get booking by ID
router.get('/booking/:id', (req: Request, res: Response) => {
    const result = getBookingById(parseInt(req.params.id));
    res.json(result);
});

// Get bookings for a specific user (either as owner or minder)
router.get('/bookings/user/:id', (req: Request, res: Response) => {
    const result = getBookingsForUser(parseInt(req.params.id));
    res.json(result);
});

// Get bookings for a specific pet
router.get('/bookings/pet/:id', (req: Request, res: Response) => {
    const result = getBookingsForPet(parseInt(req.params.id));
    res.json(result);
});

// Get bookings for a specific minder
router.get('/bookings/minder/:id', (req: Request, res: Response) => {
    const result = getBookingsForMinder(parseInt(req.params.id));
    res.json(result);
});

// Create a new booking
router.post('/booking', (req: Request, res: Response) => {
    const result = createBooking(req.body);
    res.json(result.booking);
});

// Update booking status
router.put('/booking/:id/status', (req: Request, res: Response) => {
    const result = updateBookingStatus(parseInt(req.params.id),req.body.status);
    res.json(result.booking);
});

// Update booking details
router.put('/booking/:id', (req: Request, res: Response) => {
    const result = updateBookingDetails(parseInt(req.params.id), req.body);
    res.json(result.booking);
});

// Delete a booking
router.delete('/booking/:id', (req: Request, res: Response) => {
    const result = deleteBooking(parseInt(req.params.id));
    res.json(result);
});

export default router;