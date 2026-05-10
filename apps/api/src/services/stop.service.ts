import prisma from '../config/prisma';

async function verifyTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip) throw { status: 404, message: 'Trip not found' };
  return trip;
}

async function verifyStopOwner(stopId: string, userId: string) {
  const stop = await prisma.stop.findFirst({
    where: { id: stopId, trip: { userId } },
  });
  if (!stop) throw { status: 404, message: 'Stop not found' };
  return stop;
}

export async function getStops(tripId: string, userId: string) {
  await verifyTripOwner(tripId, userId);
  return prisma.stop.findMany({
    where: { tripId },
    orderBy: { orderIndex: 'asc' },
    include: {
      city: true,
      activities: { include: { activity: true }, orderBy: { orderIndex: 'asc' } },
    },
  });
}

export async function createStop(tripId: string, userId: string, data: {
  cityId?: string;
  description?: string;
  startDate: string;
  endDate: string;
  sectionBudget?: number;
  orderIndex?: number;
}) {
  await verifyTripOwner(tripId, userId);
  const count = await prisma.stop.count({ where: { tripId } });
  return prisma.stop.create({
    data: {
      tripId,
      cityId: data.cityId,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      sectionBudget: data.sectionBudget,
      orderIndex: data.orderIndex ?? count,
    },
    include: { city: true },
  });
}

export async function updateStop(id: string, userId: string, data: Record<string, unknown>) {
  await verifyStopOwner(id, userId);
  const updateData: Record<string, unknown> = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate as string);
  if (data.endDate) updateData.endDate = new Date(data.endDate as string);
  return prisma.stop.update({ where: { id }, data: updateData as any });
}

export async function deleteStop(id: string, userId: string) {
  await verifyStopOwner(id, userId);
  await prisma.stop.delete({ where: { id } });
}

export async function reorderStops(tripId: string, userId: string, stops: { id: string; orderIndex: number }[]) {
  await verifyTripOwner(tripId, userId);
  await prisma.$transaction(
    stops.map((s) => prisma.stop.update({ where: { id: s.id }, data: { orderIndex: s.orderIndex } }))
  );
}

export async function addActivity(stopId: string, userId: string, data: {
  activityId?: string;
  scheduledTime?: string;
  customCost?: number;
  notes?: string;
  orderIndex?: number;
}) {
  await verifyStopOwner(stopId, userId);
  return prisma.stopActivity.create({
    data: {
      stopId,
      activityId: data.activityId,
      customCost: data.customCost,
      notes: data.notes,
      orderIndex: data.orderIndex ?? 0,
    },
    include: { activity: true },
  });
}

export async function removeActivity(stopId: string, activityId: string, userId: string) {
  await verifyStopOwner(stopId, userId);
  await prisma.stopActivity.deleteMany({ where: { id: activityId, stopId } });
}
