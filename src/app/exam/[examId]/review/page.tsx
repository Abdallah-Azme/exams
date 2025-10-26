"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { api, type ReviewData } from "@/lib/api"
import { useStore } from "@/lib/store"
import { ScoreSummaryCard } from "@/components/exam/score-summary-card"
import { AnswerReviewTable } from "@/components/exam/answer-review-table"
import { ArrowLeft, Home } from "lucide-react"

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.examId as string
  const sessionId = params.sessionId as string
  const user = useStore((state) => state.user)

  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {


    const fetchReview = async () => {
      try {
        const data = await api.getReview(examId, sessionId)
        setReviewData(data)
      } catch (error) {
        console.error("[v0] Failed to fetch review:", error)
        router.push("/error")
      } finally {
        setLoading(false)
      }
    }

    fetchReview()
  }, [user, examId, sessionId, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  if (!reviewData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Demo book Exam</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-semibold text-balance">Exam Results</h1>
          <p className="mt-2 text-lg text-muted-foreground">Review your performance and learn from your answers</p>
        </div>

        <div className="space-y-8">
          <ScoreSummaryCard
            score={reviewData.score}
            totalQuestions={reviewData.totalQuestions}
            correctAnswers={reviewData.correctAnswers}
          />

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Question Review</h2>
            {reviewData.sections.map((section, index) => (
              <AnswerReviewTable key={index} questions={section.questions} sectionName={section.name} />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>
            <Button onClick={() => router.push(`/exam/${examId}/setup`)}>Take Another Practice Test</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
