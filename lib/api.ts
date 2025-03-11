import axios from 'axios';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add request interceptor to add access token from session
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
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
        const session = await getSession();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session?.refreshToken}`,
            },
          }
        );

        const { accessToken } = response.data;
        // The session will be updated automatically by Next-Auth

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
