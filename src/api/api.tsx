import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
// اگر toast داری، فعالش کن:
// import { toast } from "react-toastify";

const api: AxiosInstance = axios.create({
  // baseURL: '192.168.10.139:3000',
  // baseURL: 'http://192.168.10.139:3000',
  // baseURL: 'http://192.168.70.199:8080/',
  baseURL: 'https://asaflive.ir/api/',
  // baseURL: "https://asaflive.ir/",
  timeout: 60000, // 60 seconds timeout
  withCredentials: true,
});


type ApiEnvelope<T = unknown> = {
  status?: number | string;   
  message?: string;
  error?: string;
  data?: T;

  // success?: boolean;
  // errors?: unknown;
};

export class BusinessError extends Error {
  name = "BusinessError";
  public status?: number;
  public payload?: unknown;

  constructor(message: string, status?: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

const excludedPaths = new Set<string>(["/login-form", "/forget-password"]);

function getCurrentPath(): string {

  return window.location.pathname;
}

function normalizeToNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function extractMessageFromEnvelope(envelope: ApiEnvelope | undefined): string | undefined {
  if (!envelope) return undefined;
  return envelope.message || envelope.error;
}

function rejectIfBusinessError(response: AxiosResponse): AxiosResponse {
  const envelope = response.data as ApiEnvelope | undefined;
  const bodyStatus = normalizeToNumber(envelope?.status);

  if (typeof bodyStatus === "number" && bodyStatus >= 400) {
    const msg =
      extractMessageFromEnvelope(envelope) ||
      `Business error (status=${bodyStatus})`;

    throw new BusinessError(msg, bodyStatus, response.data);
  }

  return response;
}

function handleUnauthorized(maybeStatus: number | undefined) {
  if (maybeStatus !== 401) return;

  const path = getCurrentPath();
  if (excludedPaths.has(path)) return;

  // 1) redirect:
  // window.location.assign("/login-form");

  // navigate("/login-form");

  // authStore.logout();
}

function getAxiosStatus(err: AxiosError): number | undefined {
  return err.response?.status;
}

function getNetworkMessage(err: AxiosError): string {
  if (err.code === "ECONNABORTED") return "درخواست به علت timeout متوقف شد";

  if (!err.response) return "خطای شبکه یا عدم دسترسی به سرور";

  if (err.response.status === 502) return "سرویس‌دهنده (Gateway) در دسترس نیست";
  if (err.response.status === 503) return "سرویس‌دهنده موقتاً در دسترس نیست";
  if (err.response.status === 500) return "خطای داخلی سرور";

  return "خطا در ارتباط با سرور";
}


api.interceptors.response.use(
  (response) => {
    return rejectIfBusinessError(response);
  },
  (error: unknown) => {
    if (error instanceof BusinessError) {
      handleUnauthorized(error.status);

      // اگر خواستی toast:
      // toast.error(error.message);

      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      const httpStatus = getAxiosStatus(error);

      const envelope = error.response?.data as ApiEnvelope | undefined;
      const bodyStatus = normalizeToNumber(envelope?.status);

      handleUnauthorized(bodyStatus ?? httpStatus);

      const message =
        extractMessageFromEnvelope(envelope) ||
        getNetworkMessage(error);

      // if ((bodyStatus ?? httpStatus) === 502) toast.error("سرویس‌دهنده قطع است");
      // else toast.error(message);

      const enriched = {
        ...error,
        friendlyMessage: message,
        businessStatus: bodyStatus,
      };

      return Promise.reject(enriched);
    }

    // toast.error("خطای غیرمنتظره");
    return Promise.reject(error);
  }
);

export default api;
