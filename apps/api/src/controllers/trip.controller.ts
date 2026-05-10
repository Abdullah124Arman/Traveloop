import { Request, Response, NextFunction } from 'express';
import { createTripSchema, updateTripSchema } from '../validators/trip.validator';
import * as tripService from '../services/trip.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await tripService.getDashboard(req.user!.userId);
    sendSuccess(res, data);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function getTrips(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;
    const trips = await tripService.getTrips(req.user!.userId, status as string);
    sendSuccess(res, trips);
  } catch (err: any) {
    next(err);
  }
}

export async function getTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user!.userId);
    sendSuccess(res, trip);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function createTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createTripSchema.parse(req.body);
    const trip = await tripService.createTrip(req.user!.userId, data);
    sendSuccess(res, trip, 201);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function updateTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateTripSchema.parse(req.body);
    const trip = await tripService.updateTrip(req.params.id, req.user!.userId, data);
    sendSuccess(res, trip);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function deleteTrip(req: Request, res: Response, next: NextFunction) {
  try {
    await tripService.deleteTrip(req.params.id, req.user!.userId);
    sendSuccess(res, null, 200, 'Trip deleted');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}
