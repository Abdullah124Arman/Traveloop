import { Request, Response, NextFunction } from 'express';
import * as searchService from '../services/search.service';
import { sendSuccess } from '../utils/response';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, type } = req.query;
    const result = await searchService.search(q as string, type as string);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
