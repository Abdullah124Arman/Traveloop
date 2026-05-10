import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  sendError(res, 'Internal server error', 500);
}
