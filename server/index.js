const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./lib/prisma');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'HyperLocal Lens API is running' });
});

// Start server
async function main() {
  await prisma.$connect();
  console.log('Database connected');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
