// node-backend/app.js

const express      = require('express');
const dotenv       = require('dotenv');
const connectDB    = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Built‑in middleware to parse JSON bodies
app.use(express.json());

// Public auth routes (no JWT required)
app.use('/api/auth', require('./routes/publicroutes'));      // handles /register and /login

// Protected user CRUD routes (JWT required)
const authenticate = require('./middleware/verifytoken');
app.use('/api/user', authenticate, require('./routes/userroutes')); 

// Protected transaction routes (JWT required)
app.use('/api/transaction', authenticate, require('./routes/transactionroutes'));

// Health‑check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;
