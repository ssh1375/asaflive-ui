import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const api: AxiosInstance = axios.create({
  // baseURL: '192.168.10.139:3000',
  // baseURL: 'http://192.168.10.139:3000',
  baseURL: "https://asaflive.ir/",
  timeout: 60000, // 60 seconds timeout
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError | unknown) => {
    const excludedPaths: string[] = ['/login-form', '/forget-password'];
    const currentPath: string = window.location.pathname;

    if (
      (error as AxiosError).response?.status === 401 &&
      !excludedPaths.includes(currentPath)
    ) {
      // window.location.href = '/login-form';
    }
    if ((error as AxiosError).response?.status === 502) {
      // toast.error("سرویس دهنده قطع است")
    }
    return Promise.reject(error);
  }
);

export default api;