import { Router } from 'express';
import {
  adminLogin,
  getDashboard,
  getStudents,
  getPayments,
  verifyPayment,
  rejectPayment,
  getRegistrations,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminEvents,
  exportStudentsCSV,
  exportRegistrationsCSV,
} from '../controllers/admin.controller';
import { validateAdminLogin, handleValidationErrors } from '../middleware/validate.middleware';
import { verifyAdminToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', validateAdminLogin, handleValidationErrors, adminLogin);

router.use(verifyAdminToken);

router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.get('/payments', getPayments);
router.put('/payments/:id/verify', verifyPayment);
router.put('/payments/:id/reject', rejectPayment);
router.get('/registrations', getRegistrations);
router.get('/events', getAdminEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/export/students', exportStudentsCSV);
router.get('/export/registrations', exportRegistrationsCSV);

export default router;
