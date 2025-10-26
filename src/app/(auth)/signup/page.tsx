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

 import { useStore } from "@/lib/store"
import { toast } from "sonner"
import { apiClient } from "@/src/utils"
import Link from "next/link"

// Define schema for signup
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  mobile: z
    .string()
    .regex(/^01[0-9]{9}$/, {
      message: "Please enter a valid Egyptian mobile number (e.g. 01234567898).",
    }),
})

type SignupFormValues = z.infer<typeof formSchema>

interface SignupResponse {
  user: {
    id: string
    name: string
    email: string
    mobile: string
  }
  token?: string
}

export default function SignupPage() {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
 
  // Create form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
    },
  })

  // React Query mutation
  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      const response = await apiClient.post<SignupResponse>("/register", values)
      return response
    },
    onSuccess: (data) => {
      toast( "Your account has been created successfully. Please check with the secretary to activate it.")
      router.push("/signin")
    },
  })

  // Submit handler
  async function onSubmit(values: SignupFormValues) {
    signupMutation.mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>
            Enter your details to sign up and start learning
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ahmed"
                        disabled={signupMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ahmed0005@example.com"
                        type="email"
                        disabled={signupMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="01234567898"
                        type="tel"
                        disabled={signupMutation.isPending}
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
                        disabled={signupMutation.isPending}
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
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="mt-2 text-sm">
           Have an account? 
           <Button variant={"link"} asChild size={"sm"}>
            <Link href={'/signin'}>
            SignIn
            </Link>
           </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}