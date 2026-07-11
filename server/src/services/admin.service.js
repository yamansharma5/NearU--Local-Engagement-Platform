const prisma = require('../../lib/prisma');

const getStats = async () => {
  const [totalUsers, totalBusinesses, activePosts, pendingEnquiries, totalCategories] =
    await Promise.all([
      prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
      prisma.business.count(),
      prisma.post.count({ where: { isActive: true } }),
      prisma.enquiry.count({ where: { status: 'PENDING' } }),
      prisma.category.count(),
    ]);

  return { totalUsers, totalBusinesses, activePosts, pendingEnquiries, totalCategories };
};

module.exports = { getStats };
