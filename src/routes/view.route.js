const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Book = require('../models/Book.model');
const Author = require('../models/Author.model');

// =====================
// 🔐 Auth Middleware
// =====================
const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.redirect('/login');

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.redirect('/login');
  }
};

// =====================
// 🔓 Public Routes
// =====================

// Signup Page
router.get('/signup', (req, res) => {
  res.render('pages/signup', { error: null });
});

// Login Page
router.get(['/', '/login'], (req, res) => {
  res.render('pages/login', { error: null });
});

// =====================
// 🔒 Protected Routes
// =====================

// Profile Page
router.get('/profile', requireAuth, (req, res) => {
  res.render('pages/profile', {
    user: {
      firstname: req.user.firstName,
      lastname: req.user.lastName,
      email: req.user.email,
    },
  });
});

// Books Page
router.get("/books", requireAuth, async (req, res, next) => {
  try {
    const books = await Book.find().populate("author", "name");

    res.render("pages/books", {
      user: {
        firstname: req.user.firstName,
        lastname: req.user.lastName,
        email: req.user.email,
        borrowedBooks: req.user.borrowedBooks.map(b => b.toString()),
      },
      books,
    });
  } catch (err) {
    next(err);
  }
});

// MyBooks Page
router.get('/mybooks', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'borrowedBooks',
    populate: { path: 'author', select: 'name' }
  });

  res.render('pages/myBooks', {
    user: {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      borrowedBooks: user.borrowedBooks
    }
  });
});

// Authors Page
router.get('/authors', requireAuth, async (req, res, next) => {
  try {
    const authors = await Author.find().populate('books', 'title');
    res.render('pages/authors', {
      user: {
        firstname: req.user.firstName,
        lastname: req.user.lastName,
        email: req.user.email,
      },
      authors,
    });
  } catch (err) {
    next(err);
  }
});

// =====================
// Profile Update (AJAX)
// =====================
router.post('/update-profile', requireAuth, async (req, res) => {
  const { firstname, lastname, email } = req.body;

  try {
    req.user.firstName = firstname;
    req.user.lastName = lastname;
    req.user.email = email;
    await req.user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =====================
// Return Book (AJAX)
// =====================
router.post('/return-book', requireAuth, async (req, res) => {
  const { bookId } = req.body;

  try {
    // Remove from user.borrowedBooks
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { borrowedBooks: bookId },
    });

    // Remove from book.borrowedBy
    await Book.findByIdAndUpdate(bookId, {
      $pull: { borrowedBy: req.user._id },
      $inc: { copiesAvailable: 1 },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Return Book Error:', err);
    res.status(500).json({ success: false });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token"); // name of your cookie
  res.redirect("/login");
});

module.exports = router;

