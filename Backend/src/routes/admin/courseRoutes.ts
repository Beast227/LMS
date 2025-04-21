import express from 'express';
import courseController from '../../controllers/courseController';

const router = express.Router();

router.post('/', courseController.CreateCourse);

export default router;