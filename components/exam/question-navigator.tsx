"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Flag, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type QuestionNavigatorProps = {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: Set<string>
  flaggedQuestions: Set<string>
  onNavigate: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="border-b p-4">
        <h3 className="font-medium">Questions</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {answeredQuestions.size} of {totalQuestions} answered
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-5 gap-2 p-4">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const questionId = `q-${i + 1}`
            const isAnswered = answeredQuestions.has(questionId)
            const isFlagged = flaggedQuestions.has(questionId)
            const isCurrent = i === currentQuestion

            return (
              <Button
                key={i}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onNavigate(i)}
                className={cn(
                  "relative h-10 w-full",
                  isAnswered && !isCurrent && "border-success bg-success/5 hover:bg-success/10",
                )}
              >
                {i + 1}
                {isFlagged && <Flag className="absolute -right-1 -top-1 h-3 w-3 fill-warning text-warning" />}
                {isAnswered && !isCurrent && <Check className="absolute -right-1 -top-1 h-3 w-3 text-success" />}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
