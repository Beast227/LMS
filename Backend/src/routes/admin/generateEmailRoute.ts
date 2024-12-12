import express from 'express';
import emailGeneration  from '../../controllers/generateEmailController';

const router = express.Router();

router.post('/', emailGeneration.generateUniqueEmail);

export default router;