// prisma/seed.js is a script to populate the database with initial data for development and testing. It uses Prisma Client to interact with the database and bcryptjs to hash passwords. The script performs the following steps:
// 1. Clears existing data from all tables to ensure a clean slate.
// 2. Creates sample categories (Food, Retail, Services, Events, Health).

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean existing data ───────────────────────────────────────────────────
  await prisma.analyticsEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.event.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.post.deleteMany();
  await prisma.businessLocation.deleteMany();
  await prisma.business.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Cleared existing data');

  // ─── Categories ───────────────────────────────────────────────────────────
  const [food, , , , health] = await Promise.all([
    prisma.category.create({ data: { name: 'Food & Dining', slug: 'food', icon: '🍽️', isActive: true } }),
    prisma.category.create({ data: { name: 'Retail & Shopping', slug: 'retail', icon: '🛍️', isActive: true } }),
    prisma.category.create({ data: { name: 'Services', slug: 'services', icon: '🔧', isActive: true } }),
    prisma.category.create({ data: { name: 'Events & Entertainment', slug: 'events', icon: '🎉', isActive: true } }),
    prisma.category.create({ data: { name: 'Health & Wellness', slug: 'health', icon: '💊', isActive: true } }),
  ]);
  console.log('✓ Created 5 categories');

  // ─── Users ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@hyperlens.com', password: await bcrypt.hash('Admin@123', SALT_ROUNDS), role: 'ADMIN', phone: '+91-9000000000' },
  });
  const user1 = await prisma.user.create({
    data: { name: 'Arjun Sharma', email: 'user1@example.com', password: await bcrypt.hash('User@123', SALT_ROUNDS), role: 'USER', phone: '+91-9111111111' },
  });
  const user2 = await prisma.user.create({
    data: { name: 'Priya Mehta', email: 'user2@example.com', password: await bcrypt.hash('User@123', SALT_ROUNDS), role: 'USER', phone: '+91-9222222222' },
  });
  const owner1 = await prisma.user.create({
    data: { name: 'Ramesh Patel', email: 'owner1@example.com', password: await bcrypt.hash('Owner@123', SALT_ROUNDS), role: 'BUSINESS', phone: '+91-9333333333' },
  });
  const owner2 = await prisma.user.create({
    data: { name: 'Sunita Verma', email: 'owner2@example.com', password: await bcrypt.hash('Owner@123', SALT_ROUNDS), role: 'BUSINESS', phone: '+91-9444444444' },
  });
  console.log('✓ Created 1 admin + 2 users + 2 business owners');

  // ─── Businesses ───────────────────────────────────────────────────────────
  const business1 = await prisma.business.create({
    data: { name: "Patel's Kitchen", description: 'Authentic home-style Indian food. Thalis, snacks, and fresh juices.', phone: '+91-9333333333', ownerId: owner1.id, categoryId: food.id, verificationStatus: 'VERIFIED' },
  });
  await prisma.businessLocation.create({
    data: {
      businessId: business1.id, address: '12, MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', lat: 12.9716, lng: 77.5946,
      openingHours: { monday: { open: '08:00', close: '22:00' }, tuesday: { open: '08:00', close: '22:00' }, wednesday: { open: '08:00', close: '22:00' }, thursday: { open: '08:00', close: '22:00' }, friday: { open: '08:00', close: '23:00' }, saturday: { open: '09:00', close: '23:00' }, sunday: { open: '10:00', close: '21:00' } },
    },
  });

  const business2 = await prisma.business.create({
    data: { name: 'Verma Wellness Clinic', description: 'General physician, physiotherapy, and preventive health checkups.', phone: '+91-9444444444', ownerId: owner2.id, categoryId: health.id, verificationStatus: 'VERIFIED' },
  });
  await prisma.businessLocation.create({
    data: {
      businessId: business2.id, address: '45, Indiranagar 100ft Road', city: 'Bangalore', state: 'Karnataka', pincode: '560038', lat: 12.9784, lng: 77.6408,
      openingHours: { monday: { open: '09:00', close: '18:00' }, tuesday: { open: '09:00', close: '18:00' }, wednesday: { open: '09:00', close: '18:00' }, thursday: { open: '09:00', close: '18:00' }, friday: { open: '09:00', close: '18:00' }, saturday: { open: '10:00', close: '14:00' }, sunday: null },
    },
  });
  console.log('✓ Created 2 businesses with locations');

  // ─── Posts ────────────────────────────────────────────────────────────────
  await prisma.post.createMany({
    data: [
      { content: "Today's special: Dal Makhani + 2 rotis + raita for just ₹99!", images: [], type: 'UPDATE', authorId: owner1.id, businessId: business1.id, lat: 12.9716, lng: 77.5946 },
      { content: '🎉 Grand Opening Offer — Free dessert with every thali this week!', images: [], type: 'OFFER', authorId: owner1.id, businessId: business1.id, lat: 12.9716, lng: 77.5946 },
      { content: 'Free health checkup camp this Saturday. Walk in between 10am–2pm.', images: [], type: 'EVENT', authorId: owner2.id, businessId: business2.id, lat: 12.9784, lng: 77.6408 },
    ],
  });
  console.log('✓ Created 3 posts');

  // ─── Offers ───────────────────────────────────────────────────────────────
  const now = new Date();
  const nextMonth = new Date(now); nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.offer.createMany({
    data: [
      { title: '20% Off on Family Thali', description: 'Valid for dine-in only. Serves 4.', discount: '20%', images: [], validFrom: now, validUntil: nextMonth, businessId: business1.id },
      { title: 'Free First Consultation', description: 'First consultation free for new patients.', discount: '100%', images: [], validFrom: now, validUntil: nextMonth, businessId: business2.id },
    ],
  });
  console.log('✓ Created 2 offers');

  // ─── Events ───────────────────────────────────────────────────────────────
  const d1 = new Date(now); d1.setDate(d1.getDate() + 7);
  const d2 = new Date(now); d2.setDate(d2.getDate() + 14);

  await prisma.event.createMany({
    data: [
      { title: 'Food Festival & Live Music', description: 'Great food, live folk music, and fun for kids.', date: d1, venue: "Patel's Kitchen, 12 MG Road", images: [], lat: 12.9716, lng: 77.5946, businessId: business1.id },
      { title: 'Free Health Checkup Camp', description: 'Free BP, sugar, and BMI checkup.', date: d2, venue: 'Verma Wellness Clinic, Indiranagar', images: [], lat: 12.9784, lng: 77.6408, businessId: business2.id },
    ],
  });
  console.log('✓ Created 2 events');

  // ─── Reviews, Follows, Saved Items ────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      { userId: user1.id, businessId: business1.id, rating: 5, content: 'Best thali in Bangalore! Very affordable and tasty.' },
      { userId: user2.id, businessId: business1.id, rating: 4, content: 'Good food, quick service. Dal makhani is outstanding.' },
      { userId: user1.id, businessId: business2.id, rating: 5, content: 'Dr. Verma is thorough and patient. Highly recommend.' },
    ],
  });
  await prisma.follow.createMany({
    data: [{ userId: user1.id, businessId: business1.id }, { userId: user2.id, businessId: business1.id }, { userId: user1.id, businessId: business2.id }],
  });
  await prisma.savedItem.createMany({
    data: [{ userId: user1.id, itemType: 'BUSINESS', itemId: business1.id }, { userId: user2.id, itemType: 'BUSINESS', itemId: business2.id }],
  });
  await prisma.analyticsEvent.createMany({
    data: [
      { businessId: business1.id, eventType: 'VIEW', metadata: { source: 'feed' } },
      { businessId: business1.id, eventType: 'FOLLOW' },
      { businessId: business1.id, eventType: 'SAVE' },
      { businessId: business2.id, eventType: 'VIEW', metadata: { source: 'search' } },
      { businessId: business2.id, eventType: 'ENQUIRY' },
    ],
  });
  console.log('✓ Created reviews, follows, saved items, analytics');

  console.log('\n✅ Seed complete!\n');
  console.log('  Admin    → admin@hyperlens.com  / Admin@123');
  console.log('  User 1   → user1@example.com    / User@123');
  console.log('  User 2   → user2@example.com    / User@123');
  console.log('  Business → owner1@example.com   / Owner@123');
  console.log('  Business → owner2@example.com   / Owner@123');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());