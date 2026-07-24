import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

export const validateStudentRegistration = [
  body('fullName').notEmpty().withMessage('Full name is required').trim(),
  body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('contactNumber').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian contact number is required'),
  body('collegeName').notEmpty().withMessage('College name is required').trim(),
  body('branch').notEmpty().withMessage('Branch is required').trim(),
  body('year').isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other']).withMessage('Invalid year'),
  body('isIEEE').isBoolean().withMessage('isIEEE must be boolean'),
  body('ieeeId').custom((value, { req }) => {
    if (req.body.isIEEE && !value) {
      throw new Error('IEEE ID is required for IEEE members');
    }
    return true;
  }),
];

export const validateAdminLogin = [
  body('username').notEmpty().withMessage('Username is required').trim(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateStudentAccess = [
  body('nexoraeId').notEmpty().withMessage('NEXORAE ID is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const validatePaymentProof = [
  body('upiId')
    .notEmpty().withMessage('UPI ID is required')
    .matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/).withMessage('Valid UPI ID is required'),
  body('transactionId')
    .notEmpty().withMessage('Transaction ID is required')
    .isLength({ min: 8 }).withMessage('Transaction ID must be at least 8 characters')
    .isAlphanumeric().withMessage('Transaction ID must contain only letters and numbers'),
];
