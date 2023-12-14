import axios from 'axios';
import { store } from '@/service/store';

const instance = axios.create({
  baseURL: 'http://10.145.129.44:8000/',
  timeout: 5000,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await store.dispatch('refreshTokens');
      
      // Change Authorization header
      originalRequest.headers['Authorization'] = 'Bearer ' + store.state.accessToken;

      // Return originalRequest object with Axios.
      return axios(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default instance;