import prisma from '../config/prisma';

async function verifyTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip) throw { status: 404, message: 'Trip not found' };
}

export async function getNotes(tripId: string, userId: string, stopId?: string, dayNumber?: number) {
  await verifyTripOwner(tripId, userId);
  return prisma.tripNote.findMany({
    where: {
      tripId,
      ...(stopId ? { stopId } : {}),
      ...(dayNumber ? { dayNumber } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createNote(tripId: string, userId: string, data: {
  stopId?: string;
  title?: string;
  content: string;
  dayNumber?: number;
}) {
  await verifyTripOwner(tripId, userId);
  return prisma.tripNote.create({ data: { tripId, ...data } });
}

export async function updateNote(id: string, userId: string, data: {
  stopId?: string;
  title?: string;
  content?: string;
  dayNumber?: number;
}) {
  const note = await prisma.tripNote.findFirst({ where: { id, trip: { userId } } });
  if (!note) throw { status: 404, message: 'Note not found' };
  return prisma.tripNote.update({ where: { id }, data });
}

export async function deleteNote(id: string, userId: string) {
  const note = await prisma.tripNote.findFirst({ where: { id, trip: { userId } } });
  if (!note) throw { status: 404, message: 'Note not found' };
  await prisma.tripNote.delete({ where: { id } });
}
