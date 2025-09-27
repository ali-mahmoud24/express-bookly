// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./src/models/user.model');
const Author = require('./src/models/author.model');
const Book = require('./src/models/book.model');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 MongoDB connected ✅');

    // Clean DB
    await User.deleteMany();
    await Author.deleteMany();
    await Book.deleteMany();

    // ==============================
    // 👤 Seed Users
    // ==============================
    const users = await User.create([
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
    ]);

    console.log('✅ Users seeded');

    // ==============================
    // ✍️ Seed Authors
    // ==============================
    const authors = await Author.create([
      {
        name: 'F. Scott Fitzgerald',
        bio: 'American novelist, best known for The Great Gatsby.',
        birthDate: new Date('1896-09-24'),
        nationality: 'American',
      },
      {
        name: 'George Orwell',
        bio: 'English novelist and journalist, famous for 1984 and Animal Farm.',
        birthDate: new Date('1903-06-25'),
        nationality: 'British',
      },
      {
        name: 'Jane Austen',
        bio: 'English novelist known for Pride and Prejudice.',
        birthDate: new Date('1775-12-16'),
        nationality: 'British',
      },
    ]);

    console.log('✅ Authors seeded');

    // ==============================
    // 📚 Seed Books
    // ==============================
    const books = await Book.create([
      {
        title: 'The Great Gatsby',
        author: authors[0]._id,
        description: 'A novel set in the Jazz Age.',
        category: 'Fiction',
        copiesAvailable: 5,
      },
      {
        title: '1984',
        author: authors[1]._id,
        description: 'A dystopian social science fiction novel.',
        category: 'Dystopian',
        copiesAvailable: 3,
      },
      {
        title: 'Animal Farm',
        author: authors[1]._id,
        description: 'An allegorical novella about a farm rebellion.',
        category: 'Political Satire',
        copiesAvailable: 4,
      },
      {
        title: 'Pride and Prejudice',
        author: authors[2]._id,
        description: 'A romantic novel of manners.',
        category: 'Romance',
        copiesAvailable: 2,
      },
    ]);

    console.log('✅ Books seeded');

    // ==============================
    // 🔗 Update Relations
    // ==============================
    // Assign books to authors
    for (const author of authors) {
      const authoredBooks = books.filter(
        (book) => book.author.toString() === author._id.toString()
      );
      author.books = authoredBooks.map((b) => b._id);
      await author.save();
    }

    // Example: let John borrow "1984" and Jane borrow "Pride and Prejudice"
    const john = users.find((u) => u.email === 'john@example.com');
    const jane = users.find((u) => u.email === 'jane@example.com');

    if (john) {
      john.borrowedBooks.push(books[1]._id); // 1984
      await john.save();

      books[1].borrowedBy.push(john._id);
      books[1].copiesAvailable -= 1;
      await books[1].save();
    }

    if (jane) {
      jane.borrowedBooks.push(books[3]._id); // Pride and Prejudice
      await jane.save();

      books[3].borrowedBy.push(jane._id);
      books[3].copiesAvailable -= 1;
      await books[3].save();
    }

    console.log('✅ Relations updated');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
