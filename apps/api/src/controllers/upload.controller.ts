import { Request, Response, NextFunction } from 'express';
import { uploadBufferToCloudinary } from '../services/upload.service';
import { sendSuccess, sendError } from '../utils/response';

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return sendError(res, 'No image file provided', 400);
    }
    const url = await uploadBufferToCloudinary(req.file.buffer, 'traveloop');
    sendSuccess(res, { url }, 201, 'Image uploaded successfully');
  } catch (err: any) {
    next(err);
  }
}
