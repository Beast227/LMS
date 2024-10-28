import express from 'express';
import adminRegisterController from '../controllers/adminRegisterController';

const router = express.Router();

router.post('/', adminRegisterController.handleNewAdmin);

export default router;