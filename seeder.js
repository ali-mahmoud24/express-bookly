// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/user.model'); // adjust path if needed

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ✅');

    // Clean DB
    await User.deleteMany();

    // Users to insert
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: '123456', // will be hashed by pre('save')
        isAdmin: true,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: '123456',
      },
    ];

    // Use create() instead of insertMany() so pre('save') runs
    await User.create(users);

    console.log('Users seeded ✅');
    process.exit();
  } catch (error) {
    console.error('Error seeding users ❌', error);
    process.exit(1);
  }
};

seedUsers();
