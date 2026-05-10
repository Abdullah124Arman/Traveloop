import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string) {
  return res.status(statusCode).json({ success: true, data, message });
}

export function sendError(res: Response, error: string, statusCode = 500) {
  return res.status(statusCode).json({ success: false, error });
}
