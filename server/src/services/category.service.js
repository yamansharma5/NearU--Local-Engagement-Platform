const prisma = require('../../lib/prisma');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

const slugify = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createCategory = async (name) => {
  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw httpError('A category with this name already exists.', 409);

  return prisma.category.create({ data: { name, slug } });
};

const updateCategory = async (id, name) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw httpError('Category not found.', 404);

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing && existing.id !== id) throw httpError('A category with this name already exists.', 409);

  return prisma.category.update({ where: { id }, data: { name, slug } });
};

const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw httpError('Category not found.', 404);

  await prisma.category.delete({ where: { id } });
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
