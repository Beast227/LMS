import express from 'express';
import teacherLoginController from '../../controllers/teacherLoginController';

const router = express.Router();

router.post('/', teacherLoginController.handleTeacherLogin);

export default router;