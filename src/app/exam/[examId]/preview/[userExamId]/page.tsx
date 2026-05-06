"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useUserExamSummary } from "@/src/hooks/use-user-exam-summary";

export default function PreviewExamPage() {
  const params = useParams();
  const router = useRouter();
  const userExamId = parseInt(params.userExamId as string, 10);

  const { data, isLoading, isError } = useUserExamSummary(userExamId);
  const [current, setCurrent] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Loading details…</div>
        </div>
      </div>
    );
  }

  if (isError || !data || !data.details || data.details.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-center">
        <div>
          <div className="text-lg font-medium text-red-600 mb-4">
            Failed to load exam details or no data available.
          </div>
          <Button onClick={() => router.push("/profile")}>Back to Profile</Button>
        </div>
      </div>
    );
  }

  const details = data.details;
  const q = details[current];
  const isCorrect = q.is_correct;

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-xl font-semibold">Exam Preview</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span>Score: {data.total_points} / {data.total_questions}</span>
            <span>{data.percentage}%</span>
          </div>
        </div>
      </header>

      {/* TOP PROGRESS BAR */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="bg-blue-500 h-1 transition-all"
          style={{ width: `${((current + 1) / details.length) * 100}%` }}
        />
      </div>

      {/* MAIN CONTENT */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="p-6 overflow-auto h-full">
            <p
              className="font-medium mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: q.question_text }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle className="group cursor-grab active:cursor-grabbing bg-gray-200 hover:bg-gray-300 w-3 flex items-center justify-center transition">
          <div className="flex flex-col gap-1">
            <span className="w-2 h-[2px] rounded bg-gray-400 group-hover:bg-gray-500" />
            <span className="w-2 h-[2px] rounded bg-gray-400 group-hover:bg-gray-500" />
            <span className="w-2 h-[2px] rounded bg-gray-400 group-hover:bg-gray-500" />
          </div>
        </ResizableHandle>

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col justify-between p-6 overflow-auto">
            <div>
              <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Question {current + 1}</span> of {details.length}
                </div>
              </div>

              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${isCorrect ? "border-green-500 bg-green-50 text-green-900" : "border-red-500 bg-red-50 text-red-900"}`}>
                  <h3 className="font-bold mb-2">Your Answer:</h3>
                  <div className="text-lg font-semibold">{q.student_answer || "Not Answered"}</div>
                </div>

                {!isCorrect && (
                  <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-900">
                    <h3 className="font-bold mb-2">Correct Answer:</h3>
                    <div className="text-lg font-semibold">{q.correct_answer}</div>
                  </div>
                )}

                {q.explanation && (
                  <div className="mt-8 p-6 rounded-lg bg-gray-50 border border-gray-200">
                    <h3 className="font-bold mb-4 text-gray-900">Explanation</h3>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: q.explanation }} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between border-t pt-4 mt-6">
              <Button
                variant="outline"
                disabled={current === 0}
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                className="gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={current === details.length - 1}
                onClick={() => setCurrent((c) => Math.min(details.length - 1, c + 1))}
                className="gap-1"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
