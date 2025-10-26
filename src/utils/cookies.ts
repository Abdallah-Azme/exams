"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function setAuthCookies(token: string) {
  const cookieStore = await cookies()

  // Store token as secure HttpOnly cookie
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
}



export async function getAuthToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  return token ?? null
}

export async function logout() {
  const cookieStore = await cookies()
  // Clear the auth token
  cookieStore.delete('token')

  // Optionally redirect to signin page
  redirect('/signin')
}