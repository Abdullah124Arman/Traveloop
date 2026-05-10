import prisma from '../config/prisma';

export async function getPosts(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return prisma.communityPost.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, photoUrl: true },
      },
      trip: { select: { id: true, name: true, place: true } },
    },
  });
}

export async function createPost(userId: string, data: { content: string; tripId?: string }) {
  return prisma.communityPost.create({
    data: { userId, content: data.content, tripId: data.tripId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, username: true, photoUrl: true },
      },
    },
  });
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      phone: true,
      city: true,
      country: true,
      additionalInfo: true,
      photoUrl: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
}

export async function updateProfile(userId: string, data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  photoUrl?: string;
}) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true, email: true, username: true, firstName: true, lastName: true,
      phone: true, city: true, country: true, additionalInfo: true, photoUrl: true, role: true,
    },
  });
}

export async function getAdminStats() {
  const [totalUsers, totalTrips, totalPosts, citiesCount] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.communityPost.count(),
    prisma.city.count(),
  ]);

  const tripsByStatus = await prisma.trip.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  const recentTrips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { user: { select: { username: true, firstName: true, lastName: true } } },
  });

  return { totalUsers, totalTrips, totalPosts, citiesCount, tripsByStatus, recentTrips };
}
