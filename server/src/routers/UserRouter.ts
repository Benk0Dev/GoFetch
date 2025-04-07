import { Router, Request, Response } from 'express';
import { AllUsersData, getUserByID, RegisterUser, loginUser, removeUser, getMinders, editUser, suspendUser, removeSuspension } from '@server/static/UserStatic';

const router = Router();

// Get all users
router.get('/users', (req: Request, res: Response) => {
    const result = AllUsersData();
    res.status(result.success ? 200 : 404).send(result.users);
});

// Get user by ID
router.get('/user/:id', (req: Request, res: Response) => {
    const result = getUserByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.user);
});

// Register user
router.post('/registerUser', (req: Request, res: Response) => {
    const result = RegisterUser(req.body);
    res.status(result.success ? 201 : 400).send(result.user);
});

// Login user
router.post('/login', (req: Request, res: Response) => {
    const credentials = req.body.credentials;
    const password = req.body.password;
    const result = loginUser(credentials, password);
    res.status(result.success ? 200 : 401).send(result.user);
});

// Delete user by ID
router.delete('/user/:id', (req: Request, res: Response) => {
    const result = removeUser(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Get minders
router.get('/minders', (req: Request, res: Response) => {
    const result = getMinders();
    res.status(result.success ? 200 : 404).send(result.users);
});

router.post('/editUser/:id', (req: Request, res: Response) => {
    const result = editUser(parseInt(req.params.id), req.body);
    res.status(result.success ? 200 : 404).send(result.message);
});

// Suspend user
router.post('/suspendUser/:id', (req: Request, res: Response) => {
    const result = suspendUser(parseInt(req.params.id), req.body);
    res.status(result.success ? 200 : 404).send(result.message);
});

// Remove suspension    
router.post('/removeSuspension/:id', (req: Request, res: Response) => {
    const result = removeSuspension(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

export default router;