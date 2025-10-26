import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import React from "react";

export default function ReviewScreen({
  moduleALocked,
  handleReviewBack,
  handleQuestionClick,
  modelAQuestions,
  examData,
  selected,
  flagged,
  handleNext,
}: any) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="text-center text-sm font-medium">
          THIS IS A TEST PREVIEW
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Check Your Work
            </h1>
            <div className="space-y-2 text-gray-600">
              {moduleALocked ? (
                <p className="text-red-600 font-semibold">
                  Time has expired for this module. You cannot return to these
                  questions.
                </p>
              ) : (
                <>
                  <p>
                    On test day, you won't be able to move on to the next module
                    until time expires.
                  </p>
                  <p>
                    For these practice questions, you can click{" "}
                    <span className="font-semibold">Next</span> when you're
                    ready to move on.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {examData?.data?.model_a?.name || "Section 1: Questions"}
                </h2>
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
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-3">
                {modelAQuestions.map((question: any, index: number) => {
                  const isAnswered = !!selected[question.id];
                  const isFlagged = flagged.has(question.id);

                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(index)}
                      disabled={moduleALocked}
                      className={`
                          relative w-12 h-12 rounded border-2 
                          flex items-center justify-center
                          font-semibold text-lg
                          transition-all 
                          ${
                            moduleALocked
                              ? "cursor-not-allowed opacity-50"
                              : "hover:scale-105"
                          }
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

              <div className="mt-8 pt-6 border-t flex items-center justify-center gap-8 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">
                    {modelAQuestions.filter((q: any) => selected[q.id]).length}
                  </span>{" "}
                  Answered
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {modelAQuestions.length -
                      modelAQuestions.filter((q: any) => selected[q.id]).length}
                  </span>{" "}
                  Unanswered
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {
                      modelAQuestions.filter((q: any) => flagged.has(q.id))
                        .length
                    }
                  </span>{" "}
                  For Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-4 px-6">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div className="text-sm text-gray-600">Student</div>
          <div className="flex gap-3">
            {!moduleALocked && (
              <Button
                variant="outline"
                onClick={handleReviewBack}
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
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
