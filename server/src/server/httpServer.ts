import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

import { setupWebSocketServer } from '../server/wsServer';
import { AllUsersData, getUserByID, getUserByUsername, RegisterUser, loginUser, removeUser, getMinders, editUser } from '../routers/UserStatic';
import { AllPets, PetByID, registerPet, removePet, addPetForUser, removePetFromUser } from '../routers/PetStatic';
import { AllServices, ServiceByID, addServiceForUser, editService, removeService } from '../routers/ServiceStatic';
import { getBookingsForUser, getAllBookings, getBookingById, getBookingsForPet, getBookingsForMinder, createBooking, updateBookingDetails, updateBookingStatus, deleteBooking } from '../routers/BookingStatic';
import { saveUploadedImage, saveUserImage, saveUserProfileImage, getImageByFilename, getUploadDir, deleteImageByFilename } from '../routers/ImageStatic';
import { getChatsForUser, getChatById, addMessage, createChat } from '../routers/MessageStatic';
import { getNotificationsForUser, markNotificationAsRead, addNotification } from '../routers/NotificationStatic';

import { log } from '../utils/utils';

const app: Express = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Initialize Socket.IO server
const io = setupWebSocketServer(server);

// Important CORS setup for Express
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Add all your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//#region Multer configuration
// Configure multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadDir());
    },
    filename: (req, file, cb) => {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// File filter to only accept image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Initialize upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
//#endregion

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
    const result = AllUsersData();
    res.status(result.success ? 200 : 404).send(result.users);
});

// Get user by ID
app.get('/user/:id', (req: Request, res: Response) => {
    const result = getUserByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.user);
});

// Get user by username
app.get('/user/username/:username', (req: Request, res: Response) => {
    const result = getUserByUsername(req.params.username);
    res.status(result.success ? 200 : 404).send(result.user);
});

// Register user
app.post('/registerUser', (req: Request, res: Response) => {
    const result = RegisterUser(req.body);
    res.status(result.success ? 201 : 400).send(result.user);
});

// Login user
app.post('/login', (req: Request, res: Response) => {
    const credentials = req.body.credentials;
    const password = req.body.password;
    const result = loginUser(credentials, password);
    res.status(result.success ? 200 : 401).send(result.user);
});

// Delete user by ID
app.delete('/user/:id', (req: Request, res: Response) => {
    const result = removeUser(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Get minders
app.get('/minders', (req: Request, res: Response) => {
    const result = getMinders();
    res.status(result.success ? 200 : 404).send(result.users);
});

app.post('/editUser/:id', (req: Request, res: Response) => {
    const result = editUser(parseInt(req.params.id), req.body);
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

//#region Pet Routes
// Get all pets
app.get('/pets', (req: Request, res: Response) => {
    const result = AllPets();
    res.status(result.success ? 200 : 404).send(result.message);
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
    const result = AllServices();
    res.status(result.success ? 200 : 404).send(result.services);
});

app.get('/service/:id', (req: Request, res: Response) => {
    const result = ServiceByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.service);
});



// Create new service
app.post('/newservice/:id', (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const result = addServiceForUser(userId, req.body);
    res.status(result.success ? 201 : 400).send(result);
});

// Edit a service
app.post('/editservice/:id', (req: Request, res: Response) => {
    const serviceId = parseInt(req.params.id);
    const result = editService(serviceId, req.body);
    res.status(result.success ? 200 : 404).send(result);
});

// Delete a service
app.delete('/deleteservice/:id', (req: Request, res: Response) => {
    const result = removeService(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

//#region Booking Routes
// Get all bookings
app.get('/bookings', (req: Request, res: Response) => {
    const result = getAllBookings();
    res.json(result);
});

// Get booking by ID
app.get('/booking/:id', (req: Request, res: Response) => {
    const result = getBookingById(parseInt(req.params.id));
    res.json(result);
});

// Get bookings for a specific user (either as owner or minder)
app.get('/bookings/user/:id', (req: Request, res: Response) => {
    const result = getBookingsForUser(parseInt(req.params.id));
    res.json(result);
});

// Get bookings for a specific pet
app.get('/bookings/pet/:id', (req: Request, res: Response) => {
    const result = getBookingsForPet(parseInt(req.params.id));
    res.json(result);
});

// Get bookings for a specific minder
app.get('/bookings/minder/:id', (req: Request, res: Response) => {
    const result = getBookingsForMinder(parseInt(req.params.id));
    res.json(result);
});

// Create a new booking
app.post('/booking', (req: Request, res: Response) => {
    const result = createBooking(req.body);
    res.json(result.booking);
});

// Update booking status
app.put('/booking/:id/status', (req: Request, res: Response) => {
    const result = updateBookingStatus(parseInt(req.params.id),req.body.status);
    res.json(result.booking);
});

// Update booking details
app.put('/booking/:id', (req: Request, res: Response) => {
    const result = updateBookingDetails(parseInt(req.params.id), req.body);
    res.json(result);
});

// Delete a booking
app.delete('/booking/:id', (req: Request, res: Response) => {
    const result = deleteBooking(parseInt(req.params.id));
    res.json(result);
});
//#endregion

//#region Image Routes
// Serve images statically
app.use('/image', express.static(getUploadDir()));

// Upload an image
app.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
    const result = saveUploadedImage(req.file);
    res.status(result.success ? 201 : 400).send(result.data);
});

// Upload an image for a specific user
app.post('/user/:userId/upload-image', upload.single('image'), (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const result = saveUserImage(userId, req.file);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Upload an image for user profile picture
app.post('/user/:userId/upload-profile-pic', upload.single('image'), (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const result = saveUserProfileImage(userId, req.file);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Get a specific image by filename
app.get('/image/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = getImageByFilename(filename);
    res.status(filePath.success ? 200 : 404).send(filePath.message);
});

// Delete an image by filename
app.delete('/image/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const result = deleteImageByFilename(filename);
    res.status(result.success ? 200 : 404).send(result.message);
});
//#endregion

//#region Message Routes and Chat routes

// Get messages for a user
app.get('/chats/:userId', (req: Request, res: Response) => {
    const result = getChatsForUser(parseInt(req.params.userId))
    res.json(result);
});

// Get chat by ID
app.get('/chat/:chatId', (req: Request, res: Response) => {
    const result = getChatById(parseInt(req.params.chatId));
    res.json(result);
});

// Add message to a chat
app.post('/chat/message', (req: Request, res: Response): void => {
  try {
    console.log('Received message request via HTTP:', req.body);
    
    // Make sure chatId and message are provided
    if (!req.body.chatId || !req.body.message) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing chatId or message data' 
      });
      return;
    }
    
    // Call the same addMessage function that the WebSocket uses
    const result = addMessage(req.body.chatId, req.body.message);
    
    // The message is emitted in the addMessage function,
    // so we don't need to emit it again here
    
    res.json(result);
  } catch (error) {
    console.error('Error in chat message endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message' 
    });
  }
});

// Create a new chat
app.post('/chat/create', (req, res) => {
    res.json(createChat(req.body));
});

//#endregion

// #region Notifications Routes
// Get notifications for a user
app.get('/notifications/:userId', (req, res) => {
    res.json(getNotificationsForUser(parseInt(req.params.userId)));
});

app.put('/notifications/:notificationId/read', (req, res) => {
    res.json(markNotificationAsRead(parseInt(req.params.notificationId)));
});

app.post('/notifications', (req, res) => {
    res.json(addNotification(req.body));
});

// #endregion

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

export function startHttpServer() {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        console.log(`Socket.IO server is running`);
    });
    return server;
}

export { app, server, io };