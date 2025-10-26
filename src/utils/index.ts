// lib/api.ts
import { ofetch } from "ofetch";
import { getAuthToken } from "./cookies";

export class ApiError extends Error {
  validationErrors?: Record<string, string[] | string>;

  constructor(message: string | Record<string, string[] | string>) {
    if (typeof message === "string") {
      super(message);
      this.message = message;
    } else {
      super("Validation Error");
      this.validationErrors = message;
    }
    this.name = "ApiError";
  }
}

export const api = ofetch.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://exams.tsd-education.com/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  async onResponse({ response }) {
    const data = response._data;

    if (data?.status === "false" || data?.status === false) {
      throw new ApiError(data.message);
    }
  },

  async onResponseError({ response }) {
    const data = response._data;
    throw new ApiError(data?.message || "An error occurred");
  },

  async onRequest({ options }) {
    try {
      // ✅ Always fetch token securely via server action
      const token = await getAuthToken();
      if (token) {
        options.headers = new Headers(options.headers as HeadersInit);
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.error("Failed to attach auth token:", err);
    }
  },
});

export const apiClient = {
  get: <T = any>(url: string, options?: any) =>
    api<T>(url, { method: "GET", ...options }),

  post: <T = any>(url: string, body?: any, options?: any) =>
    api<T>(url, { method: "POST", body, ...options }),

  put: <T = any>(url: string, body?: any, options?: any) =>
    api<T>(url, { method: "PUT", body, ...options }),

  patch: <T = any>(url: string, body?: any, options?: any) =>
    api<T>(url, { method: "PATCH", body, ...options }),

  delete: <T = any>(url: string, options?: any) =>
    api<T>(url, { method: "DELETE", ...options }),
};
