"use client"

import { z } from "zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { toast } from "sonner"
import { apiClient } from "@/src/utils"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { setAuthCookies } from "@/src/utils/cookies"

// ✅ Schema for login form
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
})

type LoginFormValues = z.infer<typeof formSchema>

interface LoginResponse {
  status: string
  message: string
  data: {
    token: string
    student: {
      id: number
      name: string
      email: string
      verification_account: string | null
      mobile: string
      is_active: number
      address: string | null
      subject: string | null
      created_at: string
      updated_at: string
    }
  }
}

export default function SigninPage() {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  // ✅ React Hook Form setup
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // ✅ React Query mutation for sign-in
  const signinMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await apiClient.post<LoginResponse>("/login", values)
      return response
    },
    onSuccess: async(data) => {
      setUser(data?.data?.student)
      const token = data.data.token
      await setAuthCookies(token)
      toast.success("Welcome back! You have signed in successfully.")
      router.push("/")
    },
  })

  // ✅ Submit handler
  async function onSubmit(values: LoginFormValues) {
    signinMutation.mutate(values)
  }

  // ✅ UI identical to Sign Up
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="student@example.com"
                        type="email"
                        disabled={signinMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        disabled={signinMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={signinMutation.isPending}
              >
                {signinMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <p className="mt-2 text-sm">
            Don’t have an account?{" "}
            <Button variant="link" asChild size="sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
