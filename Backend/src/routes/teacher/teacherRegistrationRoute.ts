import express from 'express';
import teacherRegisterController from '../../controllers/teacherRegisterController';

const router = express.Router();

router.post('/', teacherRegisterController.handleTeacherRegistration);

export default router;