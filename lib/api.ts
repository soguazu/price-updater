import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('accessToken') ||
      process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem('refreshToken') ||
          process.env.NEXT_PUBLIC_REFRESH_TOKEN;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const updateSingleDatePrice = async (date: string, newRate: number) => {
  try {
    const response = await api.post('/properties/update-rate-single-date', {
      propertyId: process.env.NEXT_PUBLIC_PROPERTY_ID,
      date,
      newRate,
    });
    toast.success('Price updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update price. Please try again.');
    throw error;
  }
};

export const updateMultipleDatePrice = async (
  startDate: string,
  endDate: string,
  newRate: number,
  weekendPrice?: number
) => {
  try {
    const response = await api.post('/properties/update-rate-multiple-dates', {
      propertyId: process.env.NEXT_PUBLIC_PROPERTY_ID,
      startDate,
      endDate,
      newRate,
    });
    toast.success('Prices updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update prices. Please try again.');
    throw error;
  }
};

export default api;
