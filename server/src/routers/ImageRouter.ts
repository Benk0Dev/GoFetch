import { Router, Request, Response } from 'express';
import { saveUploadedImage, saveUserImage, saveUserProfileImage, getImageByFilename, getUploadDir, deleteImageByFilename } from '@server/static/ImageStatic';
import multer from 'multer';
import path from 'path';
import express from 'express';

const router = Router();

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

// Serve images statically
router.use('/image', express.static(getUploadDir()));

// Upload an image
router.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
    const result = saveUploadedImage(req.file);
    res.status(result.success ? 201 : 400).send(result.data);
});

// Upload an image for a specific user
router.post('/user/:userId/upload-image', upload.single('image'), (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const result = saveUserImage(userId, req.file);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Upload an image for user profile picture
router.post('/user/:userId/upload-profile-pic', upload.single('image'), (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const result = saveUserProfileImage(userId, req.file);
    res.status(result.success ? 201 : 400).send(result.message);
});

// Get a specific image by filename
router.get('/image/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = getImageByFilename(filename);
    res.status(filePath.success ? 200 : 404).send(filePath.message);
});

// Delete an image by filename
router.delete('/image/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const result = deleteImageByFilename(filename);
    res.status(result.success ? 200 : 404).send(result.message);
});

export default router;
