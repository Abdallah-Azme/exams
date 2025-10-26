"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import { Trophy, Clock, CheckCircle2, XCircle } from "lucide-react"

type ExamResult = {
  id: string
  title: string
  type: string
  score: number // 0–100
  status: "passed" | "failed"
  duration: number // in minutes
  date: string
}

export default function ResultsPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Mock results (can later be fetched from API)
  useEffect(() => {
    const mockResults: ExamResult[] = [
      {
        id: "1",
        title: "SAT Practice Test",
        type: "College Entrance",
        score: 92,
        status: "passed",
        duration: 180,
        date: "2025-10-01",
      },
      {
        id: "2",
        title: "Algebra Midterm",
        type: "Math",
        score: 68,
        status: "failed",
        duration: 90,
        date: "2025-09-25",
      },
      {
        id: "3",
        title: "Physics Final Exam",
        type: "Science",
        score: 85,
        status: "passed",
        duration: 120,
        date: "2025-09-10",
      },
      {
        id: "4",
        title: "English Grammar Quiz",
        type: "Language Arts",
        score: 76,
        status: "passed",
        duration: 45,
        date: "2025-09-02",
      },
    ]

    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 600)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">My Results</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name ?? "Student"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-balance">Exam Performance</h2>
          <p className="mt-2 text-muted-foreground">
            Review your completed exams and performance over time.
          </p>
        </div>

        {/* ✅ Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((exam) => (
            <Card
              key={exam.id}
              className={`border ${
                exam.status === "passed"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>{exam.type}</CardDescription>
                  </div>

                  {exam.status === "passed" ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Passed
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="mr-1 h-4 w-4" />
                      Failed
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Score:</span>
                  <span className="font-semibold">{exam.score}%</span>
                </div>

                <Progress
                  value={exam.score}
                  className={`h-2 ${
                    exam.status === "passed" ? "bg-green-100" : "bg-red-100"
                  }`}
                />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{exam.duration} min</span>
                  </div>
                  <span>{new Date(exam.date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/exam/${exam.id}/review`)}
                  >
                    View Details
                  </Button>
 
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ✅ Summary Section */}
        <div className="mt-12">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
              <h3 className="text-xl font-semibold">Keep it up!</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                Consistent practice improves performance. 
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
