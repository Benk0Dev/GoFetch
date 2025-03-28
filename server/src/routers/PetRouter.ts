import { Router, Request, Response } from 'express';
import { AllPets, PetByID, registerPet, removePet, addPetForUser, removePetFromUser } from '@server/static/PetStatic';

const router = Router();

// Get all pets
router.get('/pets', (req: Request, res: Response) => {
    const result = AllPets();
    res.status(result.success ? 200 : 404).send(result.message);
});

// Get pet by ID
router.get('/pet/:id', (req: Request, res: Response) => {
    const result = PetByID(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Register pet
router.post('/registerPet', (req: Request, res: Response) => {
    const result = registerPet(req.body);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Delete pet by ID
router.delete('/removePet/:id', (req: Request, res: Response) => {
    const result = removePet(parseInt(req.params.id));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Add pet for a specific user (pet owner)
router.post('/user/:userId/pet', (req: Request, res: Response) => {
    const result = addPetForUser(parseInt(req.params.userId), req.body);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Remove pet from a specific user
// router.delete('/user/:userId/pet/:petId', (req: Request, res: Response) => {
//     const result = removePetFromUser(parseInt(req.params.userId), parseInt(req.params.petId));
//     res.status(result.success ? 200 : 404).send(result.message);
// });

export default router;
