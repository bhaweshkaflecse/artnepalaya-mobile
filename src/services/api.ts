// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Set to your machine's local IP for Expo testing, or production URL
const BASE_URL = 'http://YOUR_LOCAL_IP:8080/api/v1'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration (MVP baseline)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: Dispatch logout action or attempt refresh token rotation
      console.warn('Unauthorized. Token may be expired.');
    }
    return Promise.reject(error);
  }
);