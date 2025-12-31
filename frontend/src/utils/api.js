const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

export const API_ENDPOINTS = {
  // Wallet Management
  WALLET: `${API_BASE_URL}/api/wallet`,
  WALLET_ADD: `${API_BASE_URL}/api/wallet/add`,
  WALLET_SPEND: `${API_BASE_URL}/api/wallet/spend`,
  WALLET_RESET: `${API_BASE_URL}/api/wallet/reset`,
  
  // Transaction Management
  TRANSACTIONS: `${API_BASE_URL}/api/transactions`,
  TRANSACTION_BY_ID: (transactionId) => `${API_BASE_URL}/api/transactions/${transactionId}`,
  
  // User Management
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: (userId) => `${API_BASE_URL}/api/users/${userId}/profile`,
  UPDATE_USER_PROFILE: (userId) => `${API_BASE_URL}/api/users/${userId}/profile`,
  USER_REGISTER: `${API_BASE_URL}/api/users/register`,
};

export default API_BASE_URL;

