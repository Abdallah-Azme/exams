"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription>We encountered an error while processing your request. Please try again.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button onClick={() => router.back()} variant="default" className="w-full">
            Go Back
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="w-full">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
