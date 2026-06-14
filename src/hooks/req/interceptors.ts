// src/lib/axios/interceptors.ts
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
// import { refreshApi } from "./instance";
// import { tokenStorage } from "./tokenStorage";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function setupInterceptors(api: AxiosInstance) {
  
//   api.interceptors.request.use(
//     (config) => {
//       const token = tokenStorage.getAccess();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

  
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // try {
        //   const refreshToken = tokenStorage.getRefresh();
        //   if (!refreshToken) throw new Error("No refresh token");

        //   const { data } = await refreshApi.post("/auth/refresh", {
        //     refresh: refreshToken,
        //   });

        //   tokenStorage.setTokens(data.access, data.refresh);
        //   processQueue(null, data.access);

        //   originalRequest.headers.Authorization = `Bearer ${data.access}`;
        //   return api(originalRequest);
        // } catch (refreshError) {
        //   processQueue(refreshError, null);
        //   tokenStorage.clear();
        //   window.location.href = "/login";
        //   return Promise.reject(refreshError);
        // } finally {
        //   isRefreshing = false;
        // }
      }

      return Promise.reject(error);
    }
  );
}
