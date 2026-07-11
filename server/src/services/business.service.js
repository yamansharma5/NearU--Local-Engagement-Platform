const prisma = require('../../lib/prisma');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

// Returns full business profile with its active posts and category.
// Posts are ordered newest-first so the frontend can render them directly.
const getBusinessById = async (id) => {
  return prisma.business.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      owner: {
        select: { id: true, name: true, email: true, phone: true },
      },
      posts: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

const getOwnBusiness = async (ownerId) => {
  return prisma.business.findUnique({
    where: { ownerId },
    include: { category: true },
  });
};

const updateOwnBusiness = async (ownerId, data) => {
  const business = await prisma.business.findUnique({ where: { ownerId } });
  if (!business) {
    throw Object.assign(new Error('Business profile not found.'), { statusCode: 404 });
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw Object.assign(new Error('Category not found.'), { statusCode: 404 });
  }

  const locationChanged = data.lat !== undefined || data.lng !== undefined;
  return prisma.$transaction(async (tx) => {
    const updated = await tx.business.update({
      where: { id: business.id },
      data,
      include: { category: true },
    });
    if (locationChanged) {
      await tx.post.updateMany({
        where: { businessId: business.id, isActive: true },
        data: { lat: updated.lat, lng: updated.lng },
      });
    }
    return updated;
  });
};

const listAllBusinesses = async ({ search } = {}) => {
  return prisma.business.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { owner: { email: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      category: true,
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
};

const toggleBusinessStatus = async (id) => {
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) throw httpError('Business not found.', 404);

  return prisma.business.update({
    where: { id },
    data: { isActive: !business.isActive },
    include: { owner: { select: { id: true, name: true, email: true } }, category: true },
  });
};

module.exports = {
  getBusinessById,
  getOwnBusiness,
  updateOwnBusiness,
  listAllBusinesses,
  toggleBusinessStatus,
};
