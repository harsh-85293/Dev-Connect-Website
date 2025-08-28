import axios from 'axios';
import { BASE_URL } from './constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Profile API functions
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile/view');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/profile/edit', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh profile data
  refreshProfile: async () => {
    try {
      const response = await api.get('/profile/view');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Auth API functions
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Feed API functions
export const feedAPI = {
  // Get feed data
  getFeed: async () => {
    try {
      const response = await api.get('/feed');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Payments API functions
export const paymentsAPI = {
  // Create PhonePe session
  createPhonePeSession: async (payload = {}) => {
    try {
      const response = await api.post('/payments/phonepe/create', payload);
      return response.data; // { url, txnId }
    } catch (error) {
      throw error;
    }
  },
  confirmPhonePePayment: async (payload = {}) => {
    try {
      const response = await api.post('/payments/phonepe/confirm', payload);
      return response.data; // { message, user }
    } catch (error) {
      throw error;
    }
  },
};

export default api;
