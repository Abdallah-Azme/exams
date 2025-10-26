"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useExamProctor } from "@/hooks/use-exam-proctor";
import ActiveExamHeader from "@/src/modules/exams/ui/active-exam-header";
import DesmosCalculator from "@/src/modules/exams/ui/desmos-calculator";
import ErrorDialog from "@/src/modules/exams/ui/error-dialog";
import ReviewScreen from "@/src/modules/exams/ui/review-screen";
import { apiClient } from "@/src/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Answer = {
  id: number;
  text: string;
  is_correct: boolean;
};

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
  answers?: Answer[];
  explanation?: string | null;
};

type ExamData = {
  model_a: {
    name: string;
    questions: Question[];
  };
  model_b: {
    name: string;
    questions: Record<string, Question>;
  };
};

type ApiResponse = {
  status: string;
  message: string;
  data: ExamData;
};

export default function DynamicExam() {
  const { examId } = useParams();
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [currentModule, setCurrentModule] = useState<
    "model_a" | "model_b" | "review_a"
  >("model_a");
  const [showReview, setShowReview] = useState(false);
  const [moduleALocked, setModuleALocked] = useState(false);
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);

  // Submit exam mutation
  const submitExamMutation = useMutation({
    mutationFn: (payload: any) => {
      console.log("Submitting payload:", payload);
      return apiClient.post("/user-exams/submit-all-answers", payload);
    },
    onSuccess: () => {
      console.log("Exam submitted successfully");
      router.push("/profile");
    },
  });

  // Prepare answers for submission
  const prepareAnswers = () => {
    const allQuestions = [...modelAQuestions, ...modelBQuestions];
    const answers = allQuestions
      .filter((q) => selected[q.id])
      .map((q) => {
        const answer = selected[q.id];

        if (q.type === "mcq") {
          return {
            user_exam_question_id: q.id,
            answer_id: parseInt(answer),
          };
        } else {
          return {
            user_exam_question_id: q.id,
            answer_text: answer,
          };
        }
      });

    return {
      user_exam_id: userExamId,
      has_cheated: false, // Will be overridden if needed
      answers: answers,
    };
  };

  // Handle exam submission due to cheating
  const handleCheatingSubmit = () => {
    console.log("Cheating detected - submitting exam");
    if (!userExamId) {
      console.error("No user_exam_id available for submission");
      return;
    }
    const payload = {
      ...prepareAnswers(),
      has_cheated: true, // Mark as cheated
      Cheating_reason: isInFullscreen
        ? " Student out the full screen"
        : "The student open another tab",
    };
    submitExamMutation.mutate(payload);
  };

  // Use the proctoring hook
  const { showWarning, countdown, isInFullscreen, hasFocus, isTimerActive } =
    useExamProctor({
      onViolationTimeout: handleCheatingSubmit,
      isEnabled: examStarted,
    });

  // Get exam details
  const {
    data: examData,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useQuery<ApiResponse>({
    queryKey: ["examDetails", examId],
    queryFn: () => apiClient.get(`/exams/one/${examId}`),
  });

  // Get questions based on current module
  const modelAQuestions = examData?.data?.model_a?.questions || [];
  const modelBQuestions = Object.values(
    examData?.data?.model_b?.questions || {}
  );

  const questions =
    currentModule === "model_a" || currentModule === "review_a"
      ? modelAQuestions
      : modelBQuestions;

  // Enroll Mutation - first mutation
  const enrollMutation = useMutation({
    mutationFn: () => apiClient.post("/user-exams/enroll", { exam_id: examId }),
  });

  // Start Exam Mutation - second mutation
  const startExamMutation = useMutation({
    mutationFn: (userExamId: number) =>
      apiClient.post(`/user-exams/${userExamId}/start`, {
        exam_id: examId,
      }),
    onSuccess: (response) => {
      console.log("Start exam response:", response);

      const initialTime = 35 * 60;
      setTimeLeft(initialTime);
      setExamStarted(true); // Enable proctoring
    },
    onError: (error) => {
      console.error("Start exam error:", error);
      setTimeLeft(35 * 60);
      setExamStarted(true);
    },
  });

  useEffect(() => {
    if (!detailsLoading && examData) {
      enrollMutation.mutate(undefined, {
        onSuccess: (response) => {
          // Extract user_exam_id from the first mutation's response
          const enrollUserExamId = response?.data?.user_exam_id;

          console.log("Enroll response:", response);

          if (enrollUserExamId) {
            // Store the user_exam_id immediately
            setUserExamId(enrollUserExamId);
            // Pass it to the second mutation
            startExamMutation.mutate(enrollUserExamId);
          } else {
            console.error("No user_exam_id in enroll response");
          }
        },
        onError: (error) => {
          console.error("Enroll error:", error);
        },
      });
    }
  }, [detailsLoading, examData]);

  // TIMER LOGIC
  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft <= 0) {
      if (currentModule === "model_a") {
        setModuleALocked(true);
        setShowReview(true);
      } else if (currentModule === "model_b") {
        handleSubmitExam();
      }
      return;
    }
    const timer = setInterval(
      () => setTimeLeft((prev) => Math.max(0, prev! - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft, currentModule]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleFlag = () => {
    const newFlags = new Set(flagged);
    if (newFlags.has(q.id)) newFlags.delete(q.id);
    else newFlags.add(q.id);
    setFlagged(newFlags);
  };

  // Handle exam submission
  const handleSubmitExam = () => {
    if (!userExamId) {
      console.error("No user_exam_id available for submission");
      return;
    }

    const payload = {
      ...prepareAnswers(),
      has_cheated: false, // Normal submission
    };
    console.log("Submitting payload:", payload);
    submitExamMutation.mutate(payload);
  };

  if (detailsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Loading exam…</div>
          <div className="text-sm text-gray-500 mt-2">Please wait</div>
        </div>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="text-lg font-medium text-red-600">
            Failed to load exam
          </div>
          <div className="text-sm text-gray-500 mt-2">Please try again</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            No questions available
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const totalDuration = 35 * 60;
  const progressPercentage =
    ((totalDuration - (timeLeft || 0)) / totalDuration) * 100;

  const isEndOfModuleA =
    currentModule === "model_a" && current === modelAQuestions.length - 1;
  const isEndOfModuleB =
    currentModule === "model_b" && current === modelBQuestions.length - 1;

  const handleNext = () => {
    if (isEndOfModuleA && !showReview) {
      setShowReview(true);
      // Don't lock module A here - only lock when time expires or moving to module B
    } else if (showReview) {
      setShowReview(false);
      setCurrentModule("model_b");
      setCurrent(0);
      setTimeLeft(35 * 60);
      setModuleALocked(true); // Lock module A when proceeding to module B
    } else {
      setCurrent((c) => Math.min(questions.length - 1, c + 1));
    }
  };

  const handleReviewBack = () => {
    if (!moduleALocked) {
      setShowReview(false);
    }
  };

  const handleQuestionClick = (index: number) => {
    if (!moduleALocked) {
      setCurrent(index);
      setShowReview(false);
      setCurrentModule("model_a"); // Stay in model_a to allow navigation
    }
  };

  // Show review screen
  if (showReview) {
    return (
      <ReviewScreen
        examData={examData}
        flagged={flagged}
        handleNext={handleNext}
        handleQuestionClick={handleQuestionClick}
        handleReviewBack={handleReviewBack}
        modelAQuestions={modelAQuestions}
        moduleALocked={moduleALocked}
        selected={selected}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* HEADER */}
      <ActiveExamHeader
        currentModule={currentModule}
        examData={examData}
        hasFocus={hasFocus}
        isInFullscreen={isInFullscreen}
        setShowCalculator={setShowCalculator}
        formatTime={formatTime}
        showCalculator={showCalculator}
        timeLeft={timeLeft}
      />

      {/* TOP TIMER BAR */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="bg-blue-500 h-1 transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* MAIN CONTENT */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full border-r p-6 overflow-auto hidden md:block">
            <div className="text-sm text-gray-600 mb-4">
              <div className="font-medium">Question Details:</div>
              <div>Type: {q.type}</div>
              <div>Marks: {q.marks}</div>
            </div>

            {q.explanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  Explanation:
                </div>
                <p className="text-sm text-blue-800">{q.explanation}</p>
              </div>
            )}
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
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Question {current + 1}</span> of{" "}
                  {questions.length}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFlag}
                  className="flex items-center gap-2"
                >
                  <Flag
                    size={14}
                    className={
                      flagged.has(q.id) ? "text-blue-600 fill-blue-600" : ""
                    }
                  />
                  {flagged.has(q.id) ? "Flagged" : "Mark for Review"}
                </Button>
              </div>

              <p className="font-medium mb-6 leading-relaxed">
                {q.question_text}
              </p>

              <div className="space-y-3">
                {q.type === "mcq" && q.answers && q.answers.length > 0 ? (
                  <>
                    <Label className="text-sm font-medium text-gray-700">
                      Select your answer:
                    </Label>
                    <RadioGroup
                      value={selected[q.id] || ""}
                      onValueChange={(value) =>
                        setSelected((prev) => ({ ...prev, [q.id]: value }))
                      }
                    >
                      {q.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem
                            value={answer.id.toString()}
                            id={`answer-${answer.id}`}
                          />
                          <Label
                            htmlFor={`answer-${answer.id}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {answer.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </>
                ) : (
                  <>
                    <Label
                      htmlFor="answer"
                      className="text-sm font-medium text-gray-700"
                    >
                      Your Answer:
                    </Label>
                    <textarea
                      id="answer"
                      placeholder="Type your answer here..."
                      value={selected[q.id] || ""}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      className="w-full min-h-[120px] p-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                    />
                  </>
                )}
                <p className="text-xs text-gray-500">
                  Question type: {q.type} • Worth {q.marks} marks
                </p>
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

              {isEndOfModuleA ? (
                <Button
                  onClick={handleNext}
                  className="gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Review
                </Button>
              ) : isEndOfModuleB ? (
                <Button
                  onClick={handleSubmitExam}
                  disabled={submitExamMutation.isPending || !userExamId}
                  className="gap-1 bg-green-600 hover:bg-green-700"
                >
                  {submitExamMutation.isPending
                    ? "Submitting..."
                    : "Submit Exam"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleNext}
                  className="gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* FOOTER */}
      <footer className="text-xs text-center text-gray-400 border-t py-1">
        Mathematics Exam • Module{" "}
        {currentModule === "model_a" || currentModule === "review_a"
          ? "1"
          : "2"}{" "}
        • Question {current + 1} of {questions.length}
      </footer>

      {/* DESMOS CALCULATOR MODAL */}
      {showCalculator && (
        <DesmosCalculator setShowCalculator={setShowCalculator} />
      )}

      {/* PROCTORING WARNING DIALOG */}
      <ErrorDialog
        countdown={countdown}
        hasFocus={hasFocus}
        isInFullscreen={isInFullscreen}
        showWarning={showWarning}
      />
    </div>
  );
}
