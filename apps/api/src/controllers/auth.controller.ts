import { Request, Response, NextFunction } from 'express';
import { loginSchema, signupSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.username, data.password);
    sendSuccess(res, result, 200, 'Login successful');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const data = signupSchema.parse(req.body);
    const result = await authService.signup(data);
    sendSuccess(res, result, 201, 'Account created');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}
