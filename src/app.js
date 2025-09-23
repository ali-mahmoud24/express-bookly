require('dotenv').config();

const express = require('express');

const userRouter = require('./routes/users.routes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);

module.exports = app;
