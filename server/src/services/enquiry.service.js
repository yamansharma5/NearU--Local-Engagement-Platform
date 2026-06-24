const prisma = require('../../lib/prisma');

// Creates an enquiry after verifying the business exists and — when a postId is
// given — that the post actually belongs to that business. This prevents a user
// from referencing a random post that has nothing to do with the business.
const createEnquiry = async ({ userId, businessId, postId, message }) => {
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    const err = new Error('Business not found.');
    err.statusCode = 404;
    throw err;
  }

  if (postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.businessId !== businessId) {
      const err = new Error('Post not found or does not belong to this business.');
      err.statusCode = 404;
      throw err;
    }
  }

  return prisma.enquiry.create({
    data: {
      userId,
      businessId,
      message,
      status: 'PENDING',
      ...(postId && { postId }),
    },
    include: {
      business: { select: { id: true, name: true } },
      post: { select: { id: true, title: true } },
    },
  });
};

const getBusinessEnquiries = async (ownerId) => {
  const business = await prisma.business.findUnique({ where: { ownerId } });
  if (!business) throw Object.assign(new Error('Business profile not found.'), { statusCode: 404 });
  return prisma.enquiry.findMany({
    where: { businessId: business.id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      post: { select: { id: true, title: true, type: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const markEnquiryReplied = async (ownerId, enquiryId) => {
  const [business, enquiry] = await Promise.all([
    prisma.business.findUnique({ where: { ownerId } }),
    prisma.enquiry.findUnique({ where: { id: enquiryId } }),
  ]);
  if (!business) throw Object.assign(new Error('Business profile not found.'), { statusCode: 404 });
  if (!enquiry) throw Object.assign(new Error('Enquiry not found.'), { statusCode: 404 });
  if (enquiry.businessId !== business.id) {
    throw Object.assign(new Error('You do not own this enquiry.'), { statusCode: 403 });
  }
  return prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status: 'REPLIED' },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      post: { select: { id: true, title: true, type: true } },
    },
  });
};

module.exports = { createEnquiry, getBusinessEnquiries, markEnquiryReplied };
