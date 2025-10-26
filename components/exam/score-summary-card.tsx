"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle } from "lucide-react"

type ScoreSummaryCardProps = {
  score: number
  totalQuestions: number
  correctAnswers: number
}

export function ScoreSummaryCard({ score, totalQuestions, correctAnswers }: ScoreSummaryCardProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const incorrectAnswers = totalQuestions - correctAnswers

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-primary">{score}</div>
          <p className="mt-2 text-muted-foreground">out of {totalQuestions * 10} points</p>
        </div>

        <Progress value={percentage} className="h-3" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-semibold">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-semibold">{incorrectAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">Accuracy</p>
          <p className="text-3xl font-semibold">{percentage}%</p>
        </div>
      </CardContent>
    </Card>
  )
}
