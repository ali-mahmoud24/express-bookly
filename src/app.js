require('dotenv').config();

const express = require('express');

const userRouter = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');

const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Error handler

app.use(globalErrorHandler);

module.exports = app;
