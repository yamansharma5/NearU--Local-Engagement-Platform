const prisma = require('../../lib/prisma');

// Returns full business profile with its active posts and category.
// Posts are ordered newest-first so the frontend can render them directly.
const getBusinessById = async (id) => {
  return prisma.business.findUnique({
    where: { id },
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

module.exports = { getBusinessById, getOwnBusiness, updateOwnBusiness };
