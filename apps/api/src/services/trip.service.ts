import prisma from '../config/prisma';

export async function getTrips(userId: string, status?: string) {
  return prisma.trip.findMany({
    where: { userId, ...(status ? { status: status as any } : {}) },
    orderBy: { createdAt: 'desc' },
    include: { stops: { orderBy: { orderIndex: 'asc' } } },
  });
}

export async function getTripById(id: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: { id, userId },
    include: {
      stops: {
        orderBy: { orderIndex: 'asc' },
        include: {
          city: true,
          activities: { include: { activity: true }, orderBy: { orderIndex: 'asc' } },
        },
      },
    },
  });
  if (!trip) throw { status: 404, message: 'Trip not found' };
  return trip;
}

export async function createTrip(userId: string, data: {
  name: string;
  place?: string;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string;
  totalBudget?: number;
}) {
  return prisma.trip.create({
    data: {
      userId,
      name: data.name,
      place: data.place,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      coverPhotoUrl: data.coverPhotoUrl,
      totalBudget: data.totalBudget,
    },
  });
}

export async function updateTrip(id: string, userId: string, data: Record<string, unknown>) {
  const trip = await prisma.trip.findFirst({ where: { id, userId } });
  if (!trip) throw { status: 404, message: 'Trip not found' };

  const updateData: Record<string, unknown> = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate as string);
  if (data.endDate) updateData.endDate = new Date(data.endDate as string);

  return prisma.trip.update({ where: { id }, data: updateData as any });
}

export async function deleteTrip(id: string, userId: string) {
  const trip = await prisma.trip.findFirst({ where: { id, userId } });
  if (!trip) throw { status: 404, message: 'Trip not found' };
  await prisma.trip.delete({ where: { id } });
}

export async function getDashboard(userId: string) {
  const [recentTrips, topCities] = await Promise.all([
    prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.city.findMany({
      orderBy: { popularityScore: 'desc' },
      take: 5,
    }),
  ]);
  return { recentTrips, topCities };
}
