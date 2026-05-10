import prisma from '../config/prisma';

async function verifyTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip) throw { status: 404, message: 'Trip not found' };
}

export async function getBudget(tripId: string, userId: string) {
  await verifyTripOwner(tripId, userId);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        include: {
          activities: { include: { activity: true } },
        },
      },
    },
  });

  if (!trip) throw { status: 404, message: 'Trip not found' };

  const breakdown: Record<string, number> = {};
  let totalSpent = 0;

  for (const stop of trip.stops) {
    for (const sa of stop.activities) {
      const cost = Number(sa.customCost ?? sa.activity?.cost ?? 0);
      const type = sa.activity?.type ?? 'OTHER';
      breakdown[type] = (breakdown[type] || 0) + cost;
      totalSpent += cost;
    }
  }

  return {
    totalBudget: Number(trip.totalBudget ?? 0),
    totalSpent,
    remaining: Number(trip.totalBudget ?? 0) - totalSpent,
    breakdown,
  };
}

export async function getChecklist(tripId: string, userId: string) {
  await verifyTripOwner(tripId, userId);
  return prisma.checklistItem.findMany({ where: { tripId }, orderBy: { createdAt: 'asc' } });
}

export async function addChecklistItem(tripId: string, userId: string, data: { name: string; category: any }) {
  await verifyTripOwner(tripId, userId);
  return prisma.checklistItem.create({ data: { tripId, name: data.name, category: data.category } });
}

export async function updateChecklistItem(id: string, userId: string, data: { name?: string; category?: any; isPacked?: boolean }) {
  const item = await prisma.checklistItem.findFirst({ where: { id, trip: { userId } } });
  if (!item) throw { status: 404, message: 'Checklist item not found' };
  return prisma.checklistItem.update({ where: { id }, data });
}

export async function deleteChecklistItem(id: string, userId: string) {
  const item = await prisma.checklistItem.findFirst({ where: { id, trip: { userId } } });
  if (!item) throw { status: 404, message: 'Checklist item not found' };
  await prisma.checklistItem.delete({ where: { id } });
}
