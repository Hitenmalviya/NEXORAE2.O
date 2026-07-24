import { Router } from 'express';
import { getEvents, getEvent, registerForEvent } from '../controllers/event.controller';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

router.get('/', getEvents);
router.get('/:slug', getEvent);

router.post(
  '/:eventId/register',
  [
    body('nexoraeId').notEmpty().withMessage('NEXORAE ID is required').trim(),
    body('email').isEmail().withMessage('Valid registered email is required').normalizeEmail(),
  ],
  handleValidationErrors,
  registerForEvent
);

export default router;
