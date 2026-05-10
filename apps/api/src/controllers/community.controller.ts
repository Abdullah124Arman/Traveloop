import { Request, Response, NextFunction } from 'express';
import { createCommunityPostSchema, updateProfileSchema } from '../validators/misc.validator';
import * as communityService from '../services/community.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const posts = await communityService.getPosts(page);
    sendSuccess(res, posts);
  } catch (err) { next(err); }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createCommunityPostSchema.parse(req.body);
    const post = await communityService.createPost(req.user!.userId, data);
    sendSuccess(res, post, 201);
  } catch (err: any) {
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await communityService.getProfile(req.user!.userId);
    sendSuccess(res, user);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await communityService.updateProfile(req.user!.userId, data);
    sendSuccess(res, user);
  } catch (err: any) {
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function getAdminStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await communityService.getAdminStats();
    sendSuccess(res, stats);
  } catch (err) { next(err); }
}
