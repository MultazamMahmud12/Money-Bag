const Wallet = require('./wallet.model');

// GET - Get wallet info for a user
const getWallet = async (req, res) => {
  try {
    // Get userId from authenticated user (Firebase token)
    const userId = req.user.uid;

    let wallet = await Wallet.findOne({ userId });
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = new Wallet({ userId });
      await wallet.save();
    }

    res.status(200).json({ 
      message: 'Wallet retrieved successfully', 
      wallet: wallet
    });

  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ 
      message: 'Error fetching wallet', 
      error: error.message 
    });
  }
};

// POST - Add money to wallet
const addMoney = async (req, res) => {
  try {
    // Get userId from authenticated user (Firebase token)
    const userId = req.user.uid;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ 
        message: 'amount is required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be greater than 0' 
      });
    }

    let wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      wallet = new Wallet({ userId });
    }

    // Add to balance and income
    wallet.currentBalance += amount;
    wallet.totalIncome += amount;

    // Update reference budget if current balance exceeds it
    if (wallet.currentBalance > wallet.referenceBudget) {
      wallet.referenceBudget = wallet.currentBalance;
    }

    await wallet.save();

    res.status(200).json({ 
      message: 'Money added successfully', 
      wallet: wallet
    });

  } catch (error) {
    console.error('Error adding money:', error);
    res.status(500).json({ 
      message: 'Error adding money', 
      error: error.message 
    });
  }
};

// POST - Spend money from wallet
const spendMoney = async (req, res) => {
  try {
    // Get userId from authenticated user (Firebase token)
    const userId = req.user.uid;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ 
        message: 'amount is required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be greater than 0' 
      });
    }

    let wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      return res.status(404).json({ 
        message: 'Wallet not found' 
      });
    }

    // Check sufficient balance
    if (amount > wallet.currentBalance) {
      return res.status(400).json({ 
        message: 'Insufficient balance' 
      });
    }

    // Deduct from balance and add to expense
    wallet.currentBalance -= amount;
    wallet.totalExpense += amount;

    await wallet.save();

    res.status(200).json({ 
      message: 'Money spent successfully', 
      wallet: wallet
    });

  } catch (error) {
    console.error('Error spending money:', error);
    res.status(500).json({ 
      message: 'Error spending money', 
      error: error.message 
    });
  }
};

// POST - Reset wallet to zero
const resetWallet = async (req, res) => {
  try {
    // Get userId from authenticated user (Firebase token)
    const userId = req.user.uid;

    let wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      return res.status(404).json({ 
        message: 'Wallet not found' 
      });
    }

    // Reset wallet values
    wallet.currentBalance = 0;
    wallet.referenceBudget = 0;
    // Keep totalIncome and totalExpense for history

    await wallet.save();

    res.status(200).json({ 
      message: 'Wallet reset successfully', 
      wallet: wallet
    });

  } catch (error) {
    console.error('Error resetting wallet:', error);
    res.status(500).json({ 
      message: 'Error resetting wallet', 
      error: error.message 
    });
  }
};

module.exports = { getWallet, addMoney, spendMoney, resetWallet };