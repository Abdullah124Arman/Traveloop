import api from './api';
import type { Trip, Stop, ChecklistItem, TripNote, Invoice, BudgetSummary } from '../types';

// Trips
export const getTrips = (status?: string) =>
  api.get<any>('/trips', { params: status ? { status } : {} }).then(r => r.data.data as Trip[]);

export const getTrip = (id: string) =>
  api.get<any>(`/trips/${id}`).then(r => r.data.data as Trip);

export const createTrip = (data: Partial<Trip>) =>
  api.post<any>('/trips', data).then(r => r.data.data as Trip);

export const updateTrip = (id: string, data: Partial<Trip>) =>
  api.patch<any>(`/trips/${id}`, data).then(r => r.data.data as Trip);

export const deleteTrip = (id: string) =>
  api.delete(`/trips/${id}`);

// Stops
export const createStop = (tripId: string, data: Partial<Stop>) =>
  api.post<any>(`/trips/${tripId}/stops`, data).then(r => r.data.data as Stop);

export const updateStop = (id: string, data: Partial<Stop>) =>
  api.patch<any>(`/stops/${id}`, data).then(r => r.data.data as Stop);

export const deleteStop = (id: string) =>
  api.delete(`/stops/${id}`);

export const reorderStops = (tripId: string, stops: { id: string; orderIndex: number }[]) =>
  api.patch(`/trips/${tripId}/stops/reorder`, { stops });

// Activities
export const addActivity = (stopId: string, data: object) =>
  api.post<any>(`/stops/${stopId}/activities`, data).then(r => r.data.data);

export const removeActivity = (stopId: string, actId: string) =>
  api.delete(`/stops/${stopId}/activities/${actId}`);

// Budget
export const getBudget = (tripId: string) =>
  api.get<any>(`/trips/${tripId}/budget`).then(r => r.data.data as BudgetSummary);

// Checklist
export const getChecklist = (tripId: string) =>
  api.get<any>(`/trips/${tripId}/checklist`).then(r => r.data.data as ChecklistItem[]);

export const addChecklistItem = (tripId: string, data: { name: string; category: string }) =>
  api.post<any>(`/trips/${tripId}/checklist`, data).then(r => r.data.data as ChecklistItem);

export const updateChecklistItem = (id: string, data: Partial<ChecklistItem>) =>
  api.patch<any>(`/checklist/${id}`, data).then(r => r.data.data as ChecklistItem);

export const deleteChecklistItem = (id: string) =>
  api.delete(`/checklist/${id}`);

// Notes
export const getNotes = (tripId: string, params?: { stopId?: string; dayNumber?: number }) =>
  api.get<any>(`/trips/${tripId}/notes`, { params }).then(r => r.data.data as TripNote[]);

export const createNote = (tripId: string, data: Partial<TripNote>) =>
  api.post<any>(`/trips/${tripId}/notes`, data).then(r => r.data.data as TripNote);

export const updateNote = (id: string, data: Partial<TripNote>) =>
  api.patch<any>(`/notes/${id}`, data).then(r => r.data.data as TripNote);

export const deleteNote = (id: string) =>
  api.delete(`/notes/${id}`);

// Invoice
export const getInvoice = (tripId: string) =>
  api.get<any>(`/trips/${tripId}/invoice`).then(r => r.data.data as Invoice);

export const updateInvoice = (tripId: string, data: Partial<Invoice>) =>
  api.patch<any>(`/trips/${tripId}/invoice`, data).then(r => r.data.data as Invoice);

export const exportInvoice = (tripId: string) =>
  api.post<Blob>(`/trips/${tripId}/invoice/export`, {}, { responseType: 'blob' }).then(r => r.data);

// Dashboard
export const getDashboard = () =>
  api.get<any>('/dashboard').then(r => r.data.data);
