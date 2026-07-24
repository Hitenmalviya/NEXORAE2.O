import cloudinary from '../config/cloudinary';

export const uploadPaymentScreenshot = async (
  buffer: Buffer,
  mimeType: string,
  registrationId: string
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const currentYear = new Date().getFullYear();
    const folderPath = `nexorae/payment-proofs/${currentYear}/${registrationId}`;

    const stream = cloudinary.uploader.upload_stream(
      { folder: folderPath, secure: true },
      (error, result) => {
        if (error) return reject(error);
        if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    stream.end(buffer);
  });
};

export const deleteAsset = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset: ${publicId}`, error);
  }
};
