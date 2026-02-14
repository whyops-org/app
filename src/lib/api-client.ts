import axios, { AxiosError, AxiosRequestConfig } from "axios";

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

function getAuthBaseUrl(): string {
  if (!AUTH_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_AUTH_BASE_URL");
  }

  return AUTH_BASE_URL.replace(/\/$/, "");
}

const apiClient = axios.create({
  baseURL: getAuthBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data as { error?: string; message?: string };
      const message = data?.error || data?.message || "Request failed";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export { apiClient };

// Extended config to support both 'body' (fetch-like) and 'data' (axios)
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  init: ExtendedAxiosRequestConfig = {}
): Promise<T> {
  const { body, ...rest } = init;
  const response = await apiClient.request<T>({
    url: path,
    data: body, // Convert body to data for axios
    ...rest,
  });
  return response.data;
}

export function buildAuthUrl(path: string): string {
  const baseUrl = getAuthBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
