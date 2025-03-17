import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import { AllUsersData, getUserByID, RegisterUser } from '../routers/UserStatic';
import { AllPets, PetByID } from '../routers/PetStatic';
import { AllServices, ServiceByID } from '../routers/ServiceStatic';
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
app.get('*', (req: Request, res: Response, next) => {
    log(req.url, req);
    next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/users', (req: Request, res: Response) => {
    res.send(AllUsersData());
});

app.get('/user/:id', (req: Request, res: Response) => {
    const result = getUserByID(parseInt(req.params.id));
    res.send(result);
});

app.post('/registerUser', (req: Request, res: Response) => {
    const result = RegisterUser(req.body);
    if (!result.success) {
        res.status(400).send(result);
        return;
    }
    res.status(201).send(result);
});

app.get('/pets', (req: Request, res: Response) => {
    res.send(AllPets());
});

app.get('/pet/:id', (req: Request, res: Response) => {
    const result = PetByID(parseInt(req.params.id));
    res.send(result);
});

app.get('/services', (req: Request, res: Response) => {
    res.send(AllServices());
});

app.get('/service/:id', (req: Request, res: Response) => {
    const result = ServiceByID(parseInt(req.params.id));
    res.send(result);
});

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