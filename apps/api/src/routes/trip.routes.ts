import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as tripController from '../controllers/trip.controller';
import * as stopController from '../controllers/stop.controller';
import * as budgetController from '../controllers/budget.controller';
import * as noteController from '../controllers/note.controller';
import * as invoiceController from '../controllers/invoice.controller';

const router = Router();

router.use(authenticate);

// Dashboard
router.get('/dashboard', tripController.getDashboard);

// Trips
router.get('/trips', tripController.getTrips);
router.post('/trips', tripController.createTrip);
router.get('/trips/:id', tripController.getTrip);
router.patch('/trips/:id', tripController.updateTrip);
router.delete('/trips/:id', tripController.deleteTrip);

// Stops
router.post('/trips/:tripId/stops', stopController.createStop);
router.patch('/trips/:tripId/stops/reorder', stopController.reorderStops);
router.patch('/stops/:id', stopController.updateStop);
router.delete('/stops/:id', stopController.deleteStop);

// Stop Activities
router.post('/stops/:stopId/activities', stopController.addActivity);
router.delete('/stops/:stopId/activities/:actId', stopController.removeActivity);

// Budget
router.get('/trips/:tripId/budget', budgetController.getBudget);

// Checklist
router.get('/trips/:tripId/checklist', budgetController.getChecklist);
router.post('/trips/:tripId/checklist', budgetController.addChecklistItem);
router.patch('/checklist/:id', budgetController.updateChecklistItem);
router.delete('/checklist/:id', budgetController.deleteChecklistItem);

// Notes
router.get('/trips/:tripId/notes', noteController.getNotes);
router.post('/trips/:tripId/notes', noteController.createNote);
router.patch('/notes/:id', noteController.updateNote);
router.delete('/notes/:id', noteController.deleteNote);

// Invoice
router.get('/trips/:tripId/invoice', invoiceController.getInvoice);
router.patch('/trips/:tripId/invoice', invoiceController.updateInvoice);
router.post('/trips/:tripId/invoice/export', invoiceController.exportInvoice);

export default router;
