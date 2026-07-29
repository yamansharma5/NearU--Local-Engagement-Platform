const cron = require('node-cron');
const prisma = require('../../lib/prisma');

const expireOffers = async (now = new Date()) => {
  const result = await prisma.post.updateMany({
    where: {
      isActive: true,
      expiredAt: null,
      validUntil: { lte: now },
    },
    data: {
      isActive: false,
      expiredAt: now,
    },
  });

  return { expiredCount: result.count };
};

const startOfferExpiryJob = () => {
  const task = cron.schedule('*/10 * * * *', async () => {
    try {
      const result = await expireOffers();
      if (result.expiredCount > 0) {
        console.log(`Expired ${result.expiredCount} post(s).`);
      }
    } catch (err) {
      console.error('Offer expiry job failed:', err);
    }
  });

  expireOffers().catch((err) => {
    console.error('Initial offer expiry sweep failed:', err);
  });

  return task;
};

module.exports = { expireOffers, startOfferExpiryJob };
