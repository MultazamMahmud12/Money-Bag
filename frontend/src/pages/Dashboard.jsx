import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../utils/api';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSpendMoney, setShowSpendMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Categories available for spending
  const categories = [
    { value: 'food', label: 'Food' },
    { value: 'bills', label: 'Bills' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'transport', label: 'Transport' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch wallet data on component mount
  useEffect(() => {
    if (currentUser) {
      fetchWallet();
    }
  }, [currentUser]);

  const fetchWallet = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(API_ENDPOINTS.WALLET, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setWallet(data.wallet);
      } else {
        setError(data.message || 'Failed to fetch wallet');
      }
    } catch (err) {
      setError('Error fetching wallet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!addAmount || parseFloat(addAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(API_ENDPOINTS.TRANSACTIONS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'ADD',
          amount: parseFloat(addAmount),
          message: message || 'Money added'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setWallet(data.wallet);
        setSuccessMessage('Money added successfully!');
        setAddAmount('');
        setMessage('');
        setTimeout(() => {
          setShowAddMoney(false);
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add money');
      }
    } catch (err) {
      setError('Error adding money: ' + err.message);
    }
  };

  const handleSpendMoney = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!spendAmount || parseFloat(spendAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(spendAmount) > wallet?.currentBalance) {
      setError('Insufficient balance');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(API_ENDPOINTS.TRANSACTIONS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'SPEND',
          category: category,
          amount: parseFloat(spendAmount),
          message: message || `Spent on ${category}`
        })
      });

      const data = await response.json();
      if (response.ok) {
        setWallet(data.wallet);
        setSuccessMessage('Transaction completed successfully!');
        setSpendAmount('');
        setCategory('food');
        setMessage('');
        setTimeout(() => {
          setShowSpendMoney(false);
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to complete transaction');
      }
    } catch (err) {
      setError('Error spending money: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please login to view your dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Money Bag Dashboard
          </h1>
          <p className="text-gray-500 text-lg">Welcome back, <span className="font-semibold text-gray-700">{currentUser.email}</span></p>
        </div>

        {/* Budget Display */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">💰</span> Your Wallet Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-blue-100 text-sm font-medium mb-2 uppercase tracking-wide">Current Balance</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                ${wallet?.currentBalance?.toFixed(2) || '0.00'}
              </p>
              <div className="h-1 w-16 bg-blue-300 rounded-full mt-3"></div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-green-100 text-sm font-medium mb-2 uppercase tracking-wide">Total Income</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                ${wallet?.totalIncome?.toFixed(2) || '0.00'}
              </p>
              <div className="h-1 w-16 bg-green-300 rounded-full mt-3"></div>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-red-600 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-red-100 text-sm font-medium mb-2 uppercase tracking-wide">Total Expense</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                ${wallet?.totalExpense?.toFixed(2) || '0.00'}
              </p>
              <div className="h-1 w-16 bg-red-300 rounded-full mt-3"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => {
              setShowAddMoney(!showAddMoney);
              setShowSpendMoney(false);
              setError('');
              setSuccessMessage('');
            }}
            className="group relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-3 text-lg">
              <span className="text-2xl">💵</span>
              Add Money
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => {
              setShowSpendMoney(!showSpendMoney);
              setShowAddMoney(false);
              setError('');
              setSuccessMessage('');
            }}
            className="group relative bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-3 text-lg">
              <span className="text-2xl">💸</span>
              Spend Money
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-lg flex items-center gap-3 animate-pulse">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg mb-6 shadow-lg flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Add Money Form */}
        {showAddMoney && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-emerald-100 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">💵</span> Add Money to Wallet
            </h3>
            <form onSubmit={handleAddMoney}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  placeholder="e.g., Salary, Gift, Bonus..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ✓ Confirm Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMoney(false);
                    setAddAmount('');
                    setMessage('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Spend Money Form */}
        {showSpendMoney && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-rose-100 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">💸</span> Record Expense
            </h3>
            <form onSubmit={handleSpendMoney}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all text-lg font-semibold bg-white cursor-pointer"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={spendAmount}
                    onChange={(e) => setSpendAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all text-lg font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all"
                  placeholder="What did you spend on?"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ✓ Confirm Spend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSpendMoney(false);
                    setSpendAmount('');
                    setCategory('food');
                    setMessage('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
