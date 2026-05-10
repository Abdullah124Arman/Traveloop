import prisma from '../config/prisma';

export async function search(q: string, type?: string) {
  if (!q || q.trim().length < 1) return { cities: [], activities: [] };

  const query = q.trim();

  if (type === 'city') {
    const cities = await prisma.city.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
    return { cities, activities: [] };
  }

  if (type === 'activity') {
    const activities = await prisma.activity.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { city: true },
      take: 20,
    });
    return { cities: [], activities };
  }

  // Auto-detect: search both
  const [cities, activities] = await Promise.all([
    prisma.city.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
    prisma.activity.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { city: true },
      take: 10,
    }),
  ]);
  return { cities, activities };
}
