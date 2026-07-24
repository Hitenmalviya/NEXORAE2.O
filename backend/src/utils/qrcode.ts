import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

export const generateUpiQR = async (amount: number, nexoraeId: string): Promise<string> => {
  const merchantUpiId = process.env.MERCHANT_UPI_ID;
  const merchantName = process.env.MERCHANT_NAME;
  const note = `NEXORAE-${nexoraeId}`;
  
  const upiLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName || '')}&am=${amount}&cu=INR&tn=${note}`;
  
  const qrDataUrl = await QRCode.toDataURL(upiLink, {
    width: 300,
    margin: 2,
    color: {
      dark: '#dc2626',
      light: '#050505',
    },
  });

  return qrDataUrl;
};
