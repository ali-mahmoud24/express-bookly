require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');
const bookRoutes = require('./routes/books.routes');
const authorRoutes = require('./routes/authors.routes');

const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// EJS views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files (like signup.css)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

// View Routes (for rendering EJS pages directly)
const viewRoutes = require('./routes/view.route'); // create this next
app.use('/', viewRoutes);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
