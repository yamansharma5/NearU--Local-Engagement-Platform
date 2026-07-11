const prisma = require('../../lib/prisma');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  business: { select: { id: true, name: true } },
};

const listUsers = async ({ search } = {}) => {
  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    select: USER_SELECT,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
};

const toggleUserStatus = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw httpError('User not found.', 404);
  if (user.role === 'ADMIN') throw httpError('Cannot modify another admin account.', 403);

  return prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: USER_SELECT,
  });
};

module.exports = { listUsers, toggleUserStatus };
