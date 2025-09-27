require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');
const bookRoutes = require('./routes/books.routes');
const authorRoutes = require('./routes/authors.routes');

const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

// Error handler

app.use(globalErrorHandler);

module.exports = app;
