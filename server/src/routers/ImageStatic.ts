import fs from 'fs';
import path from 'path';
import { editUser, getUserByID, getUserImages, isUserMinder } from '@server/routers/UserStatic';

// Define the upload directory path
const uploadDir = path.join(__dirname, '../images');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Get the current number of images in the directory
function getCurrentImageId(): number {
    return fs.readdirSync(uploadDir).length;
}

interface ImageUploadResult {
    success: boolean;
    message: string;
    data?: {
        imageId: number;
        filename: string;
        path: string;
    };
}

export function saveUploadedImage(file: Express.Multer.File | undefined): ImageUploadResult {
    if (!file) {
        return {
            success: false,
            message: 'No image file provided or invalid file type'
        };
    }

    const imageId = getCurrentImageId();

    const extension = path.extname(file.originalname);

    // Create new filename based on ID
    const newFilename = `${imageId}${extension}`;
    const newFilePath = path.join(uploadDir, newFilename);

    // Rename the uploaded file
    fs.renameSync(path.join(uploadDir, file.filename), newFilePath);

    return {
        success: true,
        message: 'Image uploaded successfully',
        data: {
            imageId: imageId,
            filename: newFilename,
            path: `/images/${newFilename}`
            // filename: file.filename,
            // path: `/images/${file.filename}`
        }
    };
}

export function saveUserImage(userId: number, file: Express.Multer.File | undefined): ImageUploadResult {
    if (!isUserMinder(userId).isMinder) {
        return { success: false, message: 'User is not a minder' };
    }
    if (!file) {
        return { success: false, message: 'No image file provided or invalid file type' };
    }

    const imageId = getCurrentImageId();
    const extension = path.extname(file.originalname);
    const newFilename = `${imageId}${extension}`;
    const newFilePath = path.join(uploadDir, newFilename);

    fs.renameSync(path.join(uploadDir, file.filename), newFilePath);

    try {
        const userResult = getUserByID(userId);

        const userImages = getUserImages(userId).images as string[] || [];

        userImages.push(`/images/${newFilename}`);

        if (userResult.success && userResult.user) {
            const updatedUser = {
                minderRoleInfo: {
                    pictures: userImages
                }
            };

            const editResult = editUser(userId, updatedUser);

            if (!editResult.success) {
                return { success: false, message: 'Image uploaded but failed to associate with user' };
            }
        } else {
            return { success: false, message: 'User not found' };
        }
    } catch (error) {
        console.error('Error updating user with image:', error);
    }

    return {
        success: true,
        message: 'Image uploaded successfully for user',
        data: {
            imageId: imageId,
            filename: file.filename,
            path: `/images/${file.filename}`
        }
    };
}

export function saveUserProfileImage(userId: number, file: Express.Multer.File | undefined): ImageUploadResult {
    if (!file) {
        return { success: false, message: 'No image file provided or invalid file type' };
    }

    const imageId = getCurrentImageId();
    const extension = path.extname(file.originalname);
    const newFilename = `${imageId}${extension}`;
    const newFilePath = path.join(uploadDir, newFilename);

    fs.renameSync(path.join(uploadDir, file.filename), newFilePath);

    try {
        const userResult = getUserByID(userId);

        if (userResult.success && userResult.user) {
            const updatedUser = {
                primaryUserInfo: {
                    profilePic: `/images/${newFilename}`,
                }
            };

            const editResult = editUser(userId, updatedUser);

            if (!editResult.success) {
                return { success: false, message: 'Image uploaded but failed to associate with user'};
            }
        } else {
            return { success: false, message: 'User not found'};
        }
    } catch (error) {
        console.error('Error updating user with image:', error);
    }

    return {
        success: true,
        message: 'Image uploaded successfully for user',
        data: {
            imageId: imageId,
            filename: newFilename,
            path: `/images/${newFilename}`
        }
    };
}

export function deleteImageByFilename(filename: string) {
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            return { success: true, message: 'Image deleted successfully' };
        } catch (error) {
            console.error(`Error deleting image ${filename}:`, error);
            return { success: false, message: 'Error deleting image' };
        }
    }

    return { success: false, message: 'Image not found' };
}

export function getImageByFilename(filename: string) {
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
        return { success: true, message: filePath };
    }

    return { success: false, message: 'Image not found' };
}

export function getUploadDir(): string {
    return uploadDir;
}