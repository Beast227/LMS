import express from 'express';
import adminAuthController from '../controllers/adminAuthController';

const router = express.Router();

router.post('/', adminAuthController.handleLogin);

export default router;