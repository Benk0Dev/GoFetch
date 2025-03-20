import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';

import { AllUsersData, getUserByID, getUserByUsername, RegisterUser, loginUser, removeUser, getMinders } from '../routers/UserStatic';
import { AllPets, PetByID, registerPet, removePet, addPetForUser, removePetFromUser } from '../routers/PetStatic';
import { AllServices, ServiceByID, removeService, addServiceForUser, removeServiceFromUser } from '../routers/ServiceStatic';
import { getBookingsForUser, getAllBookings } from '../routers/BookingStatic';

import { log } from '../utils/utils';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
    log(req.url, req);
    next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong!');
});

//#region User Routes
// Get all users
app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(AllUsersData());
});

// Get user by ID
app.get('/user/:id', (req: Request, res: Response) => {
    const result = getUserByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result);
});

// Get user by username
app.get('/user/username/:username', (req: Request, res: Response) => {
    const result = getUserByUsername(req.params.username);
    res.status(result.success ? 200 : 404).send(result);
});

// Register user
app.post('/registerUser', (req: Request, res: Response) => {
    const result = RegisterUser(req.body);
    res.status(result.success ? 201 : 400).send(result);
});

// Login user
app.post('/login', (req: Request, res: Response) => {
    const credentials = req.body.credentials;
    const password = req.body.password;
    const result = loginUser(credentials, password);
    res.status(result.success ? 200 : 401).send(result);
});

// Delete user by ID
app.delete('/user/:id', (req: Request, res: Response) => {
    const result = removeUser(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Get minders
app.get('/minders', (req: Request, res: Response) => {
    const result = getMinders();
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

//#region Pet Routes
// Get all pets
app.get('/pets', (req: Request, res: Response) => {
    res.status(200).send(AllPets());
});

// Get pet by ID
app.get('/pet/:id', (req: Request, res: Response) => {
    const result = PetByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Register pet
app.post('/registerPet', (req: Request, res: Response) => {
    const result = registerPet(req.body);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Delete pet by ID
app.delete('/removePet/:id', (req: Request, res: Response) => {
    const result = removePet(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Add pet for a specific user (pet owner)
app.post('/user/:userId/pet', (req: Request, res: Response) => {
    const result = addPetForUser(parseInt(req.params.userId), req.body);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Remove pet from a specific user
app.delete('/user/:userId/pet/:petId', (req: Request, res: Response) => {
    const result = removePetFromUser(parseInt(req.params.userId), parseInt(req.params.petId));
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

//#region Service Routes
app.get('/services', (req: Request, res: Response) => {
    res.status(200).send(AllServices());
});

app.get('/service/:id', (req: Request, res: Response) => {
    const result = ServiceByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

app.delete('/service/:id', (req: Request, res: Response) => {
    const result = removeService(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Add service for a specific user (pet minder)
app.post('/user/:userId/service', (req: Request, res: Response) => {
    const result = addServiceForUser(parseInt(req.params.userId), req.body);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Remove service from a specific user
app.delete('/user/:userId/service/:serviceId', (req: Request, res: Response) => {
    const result = removeServiceFromUser(parseInt(req.params.userId), parseInt(req.params.serviceId));
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

//#region Booking Routes
// Get all bookings
app.get('/bookings', (req: Request, res: Response) => {
    res.status(200).send(getAllBookings());
});

// Get bookings for a specific user
app.get('/bookings/user/:id', (req: Request, res: Response) => {
    const result = getBookingsForUser(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

export function startHttpServer() {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
    return server;
}

export { app, server };