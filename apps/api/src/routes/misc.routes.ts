import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import * as communityController from '../controllers/community.controller';
import * as searchController from '../controllers/search.controller';
import * as uploadController from '../controllers/upload.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Search
router.get('/search', authenticate, searchController.search);

// Community
router.get('/community/posts', authenticate, communityController.getPosts);
router.post('/community/posts', authenticate, communityController.createPost);

// Profile
router.get('/users/me', authenticate, communityController.getProfile);
router.patch('/users/me', authenticate, communityController.updateProfile);

// Admin
router.get('/admin/stats', authenticate, requireAdmin, communityController.getAdminStats);

// Uploads
router.post('/upload', authenticate, upload.single('image'), uploadController.uploadImage);

export default router;
