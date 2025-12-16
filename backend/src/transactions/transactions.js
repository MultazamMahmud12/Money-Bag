const Transaction = require('./transaction.model');
const Wallet = require('../wallet/wallet.model');

// POST - Create a new transaction
const createTransaction = async (req, res) => {
  try {
    // Get userId from authenticated user (Firebase token)
    const userId = req.user.uid;
    const { type, category, amount, satisfactionScore, message } = req.body;

    // Validate required fields
    if (!type || !amount) {
      return res.status(400).json({ 
        message: 'type and amount are required' 
      });
    }

    // Validate type
    if (!['ADD', 'SPEND'].includes(type)) {
      return res.status(400).json({ 
        message: 'type must be either ADD or SPEND' 
      });
    }

    // Create new transaction
    const newTransaction = new Transaction({
      userId,
      type,
      category: type === 'ADD' ? null : category,
      amount,
      satisfactionScore,
      message
    });

    await newTransaction.save();

    // Update wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId });
    }

    if (type === 'ADD') {
      wallet.currentBalance += amount;
      wallet.totalIncome += amount;
    } else {
      wallet.currentBalance -= amount;
      wallet.totalExpense += amount;
    }

    await wallet.save();

    res.status(201).json({ 
      message: 'Transaction created successfully', 
      transaction: newTransaction,
      wallet: wallet
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ 
      message: 'Error creating transaction', 
      error: error.message 
    });
  }
};

// GET - Get all transactions for a user
const getUserTransactions = async (req, res) => {
  try {
    // Get userId from authenticated user (Firebase token)
    const userId = req.user.uid;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ 
      message: 'Transactions retrieved successfully', 
      count: transactions.length,
      transactions: transactions
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ 
      message: 'Error fetching transactions', 
      error: error.message 
    });
  }
};

module.exports = { createTransaction, getUserTransactions };