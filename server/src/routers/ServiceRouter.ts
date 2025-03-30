import { Router, Request, Response } from 'express';
import { AllServices, ServiceByID, addServiceForUser, editService, removeService } from '@server/static/ServiceStatic';

const router = Router();

router.get('/services', (req: Request, res: Response) => {
    const result = AllServices();
    res.status(result.success ? 200 : 404).send(result.services);
});

router.get('/service/:id', (req: Request, res: Response) => {
    const result = ServiceByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.service);
});

// Create new service
router.post('/newservice/:id', (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const result = addServiceForUser(userId, req.body);
    res.status(result.success ? 201 : 400).send(result);
});

// Edit a service
router.post('/editservice/:id', (req: Request, res: Response) => {
    const serviceId = parseInt(req.params.id);
    const result = editService(serviceId, req.body);
    res.status(result.success ? 200 : 404).send(result);
});

// Delete a service
router.delete('/deleteservice/:id', (req: Request, res: Response) => {
    const result = removeService(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

export default router;