const prisma = require('../../lib/prisma');

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

module.exports = { getAllCategories };
