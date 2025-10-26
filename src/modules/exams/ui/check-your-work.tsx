"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";

type Question = {
  id: number;
  exam_id: number;
  module: string;
  question_text: string;
  type: "mcq" | "numeric" | string;
  marks: number;
  order: number;
  created_at: string;
  updated_at: string;
  answers?: any[];
  explanation?: string | null;
};

type CheckYourWorkProps = {
  questions: Question[];
  selected: Record<number, string>;
  flagged: Set<number>;
  onQuestionClick: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  userName?: string;
  sectionName?: string;
};

export default function CheckYourWork({
  questions,
  selected,
  flagged,
  onQuestionClick,
  onNext,
  onBack,
  userName = "Student",
  sectionName = "Section 1: Reading and Writing Questions",
}: CheckYourWorkProps) {
  const answeredCount = questions.filter((q) => selected[q.id]).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = questions.filter((q) => flagged.has(q.id)).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="text-center text-sm font-medium">
          THIS IS A TEST PREVIEW
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Check Your Work
            </h1>
            <div className="space-y-2 text-gray-600">
              <p>
                On test day, you won't be able to move on to the next module
                until time expires.
              </p>
              <p>
                For these practice questions, you can click{" "}
                <span className="font-semibold">Next</span> when you're ready to
                move on.
              </p>
            </div>
          </div>

          {/* Questions Grid Card */}
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {sectionName}
                </CardTitle>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded"></div>
                    <span className="text-gray-600">Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag size={16} className="text-red-500 fill-red-500" />
                    <span className="text-gray-600">For Review</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Question Numbers Grid */}
              <div className="flex flex-wrap gap-3">
                {questions.map((question, index) => {
                  const isAnswered = !!selected[question.id];
                  const isFlagged = flagged.has(question.id);

                  return (
                    <button
                      key={question.id}
                      onClick={() => onQuestionClick(index)}
                      className={`
                        relative w-12 h-12 rounded border-2 
                        flex items-center justify-center
                        font-semibold text-lg
                        transition-all hover:scale-105
                        ${
                          isAnswered
                            ? "border-blue-600 bg-white text-blue-600"
                            : "border-dashed border-gray-400 bg-white text-gray-600"
                        }
                      `}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag
                          size={12}
                          className="absolute -top-1 -right-1 text-red-500 fill-red-500"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="mt-8 pt-6 border-t flex items-center justify-center gap-8 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">
                    {answeredCount}
                  </span>{" "}
                  Answered
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {unansweredCount}
                  </span>{" "}
                  Unanswered
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {flaggedCount}
                  </span>{" "}
                  For Review
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4 px-6">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div className="text-sm text-gray-600">{userName}</div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Back
            </Button>
            <Button
              onClick={onNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
