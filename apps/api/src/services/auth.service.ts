import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { signToken } from '../utils/jwt';

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const token = signToken({ userId: user.id, role: user.role });
  const { passwordHash: _, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function signup(data: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  photoUrl?: string;
}) {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });
  if (exists) throw { status: 409, message: 'Email or username already in use' };

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city,
      country: data.country,
      additionalInfo: data.additionalInfo,
      photoUrl: data.photoUrl,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  const { passwordHash: _, ...safeUser } = user;
  return { token, user: safeUser };
}
