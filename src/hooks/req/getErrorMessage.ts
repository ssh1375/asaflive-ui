import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "خطای ناشناخته‌ای رخ داد"
    );
  }
  return "خطای غیرمنتظره";
}
