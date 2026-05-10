import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

if (env.CLOUDINARY_URL) {
  // It automatically configures itself if CLOUDINARY_URL is in env
  // but we can ensure it's initialized correctly if we want.
}

export async function uploadBufferToCloudinary(buffer: Buffer, folder: string = 'traveloop'): Promise<string> {
  if (!env.CLOUDINARY_URL) {
    // Return a dummy placeholder if Cloudinary isn't configured
    return `https://ui-avatars.com/api/?name=Placeholder&background=random`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error('Unknown upload error'));
      }
    );
    uploadStream.end(buffer);
  });
}
