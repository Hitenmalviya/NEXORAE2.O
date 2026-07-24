import { Router } from 'express';
import { submitPaymentProof, resubmitPaymentProof, getPaymentStatus } from '../controllers/payment.controller';
import { uploadScreenshot } from '../middleware/upload.middleware';
import { validatePaymentProof, handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

router.post('/submit-proof', uploadScreenshot, validatePaymentProof, handleValidationErrors, submitPaymentProof);
router.post('/resubmit/:paymentId', uploadScreenshot, validatePaymentProof, handleValidationErrors, resubmitPaymentProof);
router.get('/:paymentId', getPaymentStatus);

export default router;
