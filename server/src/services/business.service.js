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

module.exports = { getBusinessById };
