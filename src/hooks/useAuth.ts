import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUIStore } from "../store/useUIStore";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type ApiError = {
  status?: number;
  businessStatus?: number;
  message?: string;
};

export function useAuth() {
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const setAuth = useUIStore((state) => state.setAuth);
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/me");

        if (!response.data || Object.keys(response.data).length === 0) {
          return null;
        }

        return response.data;

      } catch (err) {

        const error = err as ApiError;

        error?.businessStatus === 502
          ? toast.error("ارتباط با سرویس دهنده قطع شده")
          : toast.error("خطا در استعلام کاربری شما");

        if (error?.status === 401) {
          navigate("/login");
        }

        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.isLoading) {
      setAuth(query.data ?? null);
    }
  }, [query.data, query.isLoading, setAuth]);

  const withAuthGuard = async (action: () => void) => {
    const { data } = await query.refetch();

    if (!data) {
      openAuthModal();
      return;
    }

    action();
  };

  return {
    user: query.data,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
    withAuthGuard,
  };
}

