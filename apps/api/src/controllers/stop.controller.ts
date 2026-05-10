import { Request, Response, NextFunction } from 'express';
import { createStopSchema, updateStopSchema, reorderStopsSchema } from '../validators/stop.validator';
import { addStopActivitySchema } from '../validators/misc.validator';
import * as stopService from '../services/stop.service';
import { sendSuccess, sendError } from '../utils/response';

export async function createStop(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createStopSchema.parse(req.body);
    const stop = await stopService.createStop(req.params.tripId, req.user!.userId, data);
    sendSuccess(res, stop, 201);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function updateStop(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateStopSchema.parse(req.body);
    const stop = await stopService.updateStop(req.params.id, req.user!.userId, data);
    sendSuccess(res, stop);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function deleteStop(req: Request, res: Response, next: NextFunction) {
  try {
    await stopService.deleteStop(req.params.id, req.user!.userId);
    sendSuccess(res, null, 200, 'Stop deleted');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function reorderStops(req: Request, res: Response, next: NextFunction) {
  try {
    const data = reorderStopsSchema.parse(req.body);
    await stopService.reorderStops(req.params.tripId, req.user!.userId, data.stops);
    sendSuccess(res, null, 200, 'Stops reordered');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function addActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const data = addStopActivitySchema.parse(req.body);
    const result = await stopService.addActivity(req.params.stopId, req.user!.userId, data);
    sendSuccess(res, result, 201);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function removeActivity(req: Request, res: Response, next: NextFunction) {
  try {
    await stopService.removeActivity(req.params.stopId, req.params.actId, req.user!.userId);
    sendSuccess(res, null, 200, 'Activity removed');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}
