const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions } = require('./transactions');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');

// All routes require authentication
router.use(verifyFirebaseToken);

// POST /api/transactions - Create a new transaction
router.post('/', createTransaction);

// GET /api/transactions - Get all transactions for authenticated user
router.get('/', getUserTransactions);

module.exports = router;

