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

/**
 * Reads the auth token available to client-side JS.
 * Falls back to the httpOnly cookie via server action when on the server.
 */
export function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const match = cookies.find((row) => row.startsWith("client_token="));
  return match ? decodeURIComponent(match.substring("client_token=".length)) : null;
}

/**
 * Writes the token to a client-accessible cookie so apiClient can attach it
 * as a Bearer header on every request. Called right after a successful login.
 */
export function setClientToken(token: string): void {
  if (typeof window === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `client_token=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/${secure}; SameSite=Lax`;
}

/**
 * Removes the client-accessible token cookie (called on logout).
 */
export function clearClientToken(): void {
  if (typeof window === "undefined") return;
  document.cookie = "client_token=; Max-Age=0; Path=/";
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
      let token: string | null = null;

      if (typeof window === "undefined") {
        // Server-side: use the Next.js server action to read the HttpOnly cookie
        token = await getAuthToken();
      } else {
        // Client-side: read the non-HttpOnly client_token cookie directly
        token = getClientToken();
      }

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
