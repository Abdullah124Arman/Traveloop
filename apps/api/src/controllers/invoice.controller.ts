import { Request, Response, NextFunction } from 'express';
import { updateInvoiceSchema } from '../validators/misc.validator';
import * as invoiceService from '../services/invoice.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const invoice = await invoiceService.getInvoice(req.params.tripId, req.user!.userId);
    sendSuccess(res, invoice);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateInvoiceSchema.parse(req.body);
    const invoice = await invoiceService.updateInvoice(req.params.tripId, req.user!.userId, data);
    sendSuccess(res, invoice);
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    if (err.name === 'ZodError') return sendError(res, err.errors[0]?.message || 'Validation error', 400);
    next(err);
  }
}

export async function exportInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await invoiceService.exportInvoice(req.params.tripId, req.user!.userId);
    sendSuccess(res, data, 200, 'Invoice export ready');
  } catch (err: any) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}
