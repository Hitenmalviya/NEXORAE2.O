import { Router } from 'express';
import { registerStudent, getStudent, verifyStudent, getStudentMe } from '../controllers/student.controller';
import { validateStudentRegistration, validateStudentAccess, handleValidationErrors } from '../middleware/validate.middleware';
import { verifyStudentToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateStudentRegistration, handleValidationErrors, registerStudent);
router.post('/verify', validateStudentAccess, handleValidationErrors, verifyStudent);
router.get('/me', verifyStudentToken, getStudentMe);
router.get('/:nexoraeId', getStudent);

export default router;
