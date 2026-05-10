import { Request, Response, NextFunction } from 'express';
import { addChecklistItemSchema, updateChecklistItemSchema } from '../validators/checklist.validator';
import * as budgetService from '../services/budget.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await budgetService.getBudget(req.params.tripId, req.user!.userId);
    sendSuccess(res, data);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function getChecklist(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await budgetService.getChecklist(req.params.tripId, req.user!.userId);
    sendSuccess(res, items);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function addChecklistItem(req: Request, res: Response, next: NextFunction) {
  try {
    const data = addChecklistItemSchema.parse(req.body);
    const item = await budgetService.addChecklistItem(req.params.tripId, req.user!.userId, data);
    sendSuccess(res, item, 201);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function updateChecklistItem(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateChecklistItemSchema.parse(req.body);
    const item = await budgetService.updateChecklistItem(req.params.id, req.user!.userId, data);
    sendSuccess(res, item);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function deleteChecklistItem(req: Request, res: Response, next: NextFunction) {
  try {
    await budgetService.deleteChecklistItem(req.params.id, req.user!.userId);
    sendSuccess(res, null, 200, 'Item deleted');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}
