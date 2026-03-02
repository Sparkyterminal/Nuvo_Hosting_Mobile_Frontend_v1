import axios from 'axios';
import { ENV } from '../../app/config/env';

export const apiClient = axios.create({
  baseURL: ENV.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
