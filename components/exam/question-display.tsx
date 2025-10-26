"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "@/lib/api"
import { X } from "lucide-react"

type QuestionDisplayProps = {
  question: Question
  selectedAnswer?: string
  onAnswerSelect: (answer: string) => void
  eliminatedOptions: Set<string>
  onEliminateOption: (option: string) => void
}

export function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerSelect,
  eliminatedOptions,
  onEliminateOption,
}: QuestionDisplayProps) {
  return (
    <div className="space-y-6">
      {question.passage && (
        <Card>
          <CardContent className="prose prose-sm max-w-none p-6 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: question.passage }} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Question {question.number}</div>
            <p className="text-lg leading-relaxed">{question.question}</p>
          </div>

          {question.image && (
            <div className="flex justify-center">
              <img
                src={question.image || "/placeholder.svg"}
                alt="Question diagram"
                className="max-h-64 rounded-md border"
              />
            </div>
          )}

          {question.type === "multiple-choice" && question.options && (
            <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect}>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const optionId = String.fromCharCode(65 + index) // A, B, C, D
                  const isEliminated = eliminatedOptions.has(optionId)

                  return (
                    <div
                      key={optionId}
                      className={`group relative flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                        isEliminated ? "opacity-40" : ""
                      } ${selectedAnswer === optionId ? "border-primary bg-primary/5" : ""}`}
                    >
                      <RadioGroupItem value={optionId} id={optionId} className="mt-0.5" disabled={isEliminated} />
                      <Label htmlFor={optionId} className="flex-1 cursor-pointer leading-relaxed">
                        <span className="mr-2 font-medium">{optionId}.</span>
                        {option}
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.preventDefault()
                          onEliminateOption(optionId)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {isEliminated && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-0.5 w-full bg-destructive/50" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
