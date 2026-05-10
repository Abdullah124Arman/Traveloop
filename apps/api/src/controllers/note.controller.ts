import { Request, Response, NextFunction } from 'express';
import { createNoteSchema, updateNoteSchema } from '../validators/note.validator';
import * as noteService from '../services/note.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const { stopId, dayNumber } = req.query;
    const notes = await noteService.getNotes(
      req.params.tripId,
      req.user!.userId,
      stopId as string,
      dayNumber ? parseInt(dayNumber as string) : undefined
    );
    sendSuccess(res, notes);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createNoteSchema.parse(req.body);
    const note = await noteService.createNote(req.params.tripId, req.user!.userId, data);
    sendSuccess(res, note, 201);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function updateNote(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateNoteSchema.parse(req.body);
    const note = await noteService.updateNote(req.params.id, req.user!.userId, data);
    sendSuccess(res, note);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    await noteService.deleteNote(req.params.id, req.user!.userId);
    sendSuccess(res, null, 200, 'Note deleted');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}
