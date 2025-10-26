"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { ReviewQuestion } from "@/lib/api"

type AnswerReviewTableProps = {
  questions: ReviewQuestion[]
  sectionName: string
}

export function AnswerReviewTable({ questions, sectionName }: AnswerReviewTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sectionName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {questions.map((q) => (
            <AccordionItem key={q.id} value={q.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between pr-4">
                  <div className="flex items-center gap-3">
                    {q.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-medium">Question {q.number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={q.isCorrect ? "default" : "destructive"} className="bg-transparent">
                      Your answer: {q.userAnswer || "Not answered"}
                    </Badge>
                    {!q.isCorrect && (
                      <Badge variant="outline" className="border-success text-success">
                        Correct: {q.correctAnswer}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Question</p>
                    <p className="leading-relaxed">{q.question}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Explanation</p>
                    <p className="leading-relaxed text-muted-foreground">{q.explanation}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
