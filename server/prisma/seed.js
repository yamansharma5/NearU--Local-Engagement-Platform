const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  console.log('Seeding NearU MVP data...');

  await prisma.enquiry.deleteMany();
  await prisma.post.deleteMany();
  await prisma.business.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [food, retail, services, events, health] = await Promise.all([
    prisma.category.create({ data: { name: 'Food', slug: 'food' } }),
    prisma.category.create({ data: { name: 'Retail', slug: 'retail' } }),
    prisma.category.create({ data: { name: 'Services', slug: 'services' } }),
    prisma.category.create({ data: { name: 'Events', slug: 'events' } }),
    prisma.category.create({ data: { name: 'Health', slug: 'health' } }),
  ]);

  void retail;
  void services;
  void events;

  const user1 = await prisma.user.create({
    data: {
      name: 'Arjun Sharma',
      email: 'user1@example.com',
      password: await bcrypt.hash('User@123', SALT_ROUNDS),
      role: 'USER',
      phone: '+91-9111111111',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Priya Mehta',
      email: 'user2@example.com',
      password: await bcrypt.hash('User@123', SALT_ROUNDS),
      role: 'USER',
      phone: '+91-9222222222',
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: 'Ramesh Patel',
      email: 'owner1@example.com',
      password: await bcrypt.hash('Owner@123', SALT_ROUNDS),
      role: 'BUSINESS',
      phone: '+91-9333333333',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Sunita Verma',
      email: 'owner2@example.com',
      password: await bcrypt.hash('Owner@123', SALT_ROUNDS),
      role: 'BUSINESS',
      phone: '+91-9444444444',
    },
  });

  const business1 = await prisma.business.create({
    data: {
      ownerId: owner1.id,
      name: "Patel's Kitchen",
      description: 'Home-style Indian meals, snacks, and fresh juices.',
      phone: '+91-9333333333',
      categoryId: food.id,
      address: '12 MG Road, Bengaluru, Karnataka 560001',
      lat: 12.9716,
      lng: 77.5946,
    },
  });

  const business2 = await prisma.business.create({
    data: {
      ownerId: owner2.id,
      name: 'Verma Wellness Clinic',
      description: 'General physician, physiotherapy, and preventive health checkups.',
      phone: '+91-9444444444',
      categoryId: health.id,
      address: '45 Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
      lat: 12.9784,
      lng: 77.6408,
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.post.createMany({
    data: [
      {
        businessId: business1.id,
        type: 'UPDATE',
        title: 'Fresh lunch thalis today',
        content: 'Dal makhani, two rotis, rice, and raita available for lunch.',
        lat: business1.lat,
        lng: business1.lng,
      },
      {
        businessId: business1.id,
        type: 'OFFER',
        title: 'Family thali offer',
        content: 'Bring the family and get a discount on our large thali.',
        discount: '20% off',
        validUntil: nextMonth,
        lat: business1.lat,
        lng: business1.lng,
      },
      {
        businessId: business2.id,
        type: 'EVENT',
        title: 'Free health checkup camp',
        content: 'Walk in for BP, sugar, and BMI checks.',
        eventDate: nextWeek,
        venue: 'Verma Wellness Clinic',
        lat: business2.lat,
        lng: business2.lng,
      },
      {
        businessId: business2.id,
        type: 'UPDATE',
        title: 'Evening physiotherapy slots open',
        content: 'New appointments are open from 5pm to 8pm this week.',
        lat: business2.lat,
        lng: business2.lng,
      },
    ],
  });

  await prisma.enquiry.create({
    data: {
      userId: user1.id,
      businessId: business1.id,
      message: 'Hi, is the family thali offer available this weekend?',
    },
  });

  console.log('Seed complete.');
  console.log('User 1   -> user1@example.com  / User@123');
  console.log('User 2   -> user2@example.com  / User@123');
  console.log('Business -> owner1@example.com / Owner@123');
  console.log('Business -> owner2@example.com / Owner@123');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
