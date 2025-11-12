"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// COMMENTED OUT: Proctoring hook
// import { useExamProctor } from "@/hooks/use-exam-proctor";
import ActiveExamHeader from "@/src/modules/exams/ui/active-exam-header";
import DesmosCalculator from "@/src/modules/exams/ui/desmos-calculator";
// COMMENTED OUT: Error dialog for proctoring
// import ErrorDialog from "@/src/modules/exams/ui/error-dialog";
import ExamFooter from "@/src/modules/exams/ui/exam-footer";
import NavigationPopover from "@/src/modules/exams/ui/navigation-popover";
import ReviewScreen from "@/src/modules/exams/ui/review-screen";
import { apiClient } from "@/src/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

type Answer = {
  id: number;
  text: string;
};

type Question = {
  id: number;
  question_text: string;
  type: "mcq" | "numeric" | string;
  marks: number;
  answers?: Answer[];
  explanation?: string | null;
  image_url?: string | null;
};

type ExamStartResponse = {
  status: string;
  message: string;
  data: {
    user_exam: {
      id: number;
      exam_id: number;
      start_time: string;
      end_time: string;
      status: string;
      total_questions: number;
      models: {
        model_a: {
          name: string;
          questions: Question[];
        };
        model_b: {
          name: string;
          questions: Question[];
        };
      };
    };
  };
};

export default function DynamicExam() {
  const { examId } = useParams();
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [showHelpSheet, setHelpSheet] = useState(false);
  const [currentModule, setCurrentModule] = useState<
    "model_a" | "model_b" | "review_a" | "review_b"
  >("model_a");
  const [showReview, setShowReview] = useState(false);
  const [moduleALocked, setModuleALocked] = useState(false);
  const [moduleBLocked, setModuleBLocked] = useState(false);
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [totalExamTime, setTotalExamTime] = useState<number>(0);

  // Add a ref to store the latest selected answers
  const selectedRef = useRef<Record<number, string>>({});

  // Update the ref whenever selected changes
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Submit exam mutation
  const submitExamMutation = useMutation({
    mutationFn: (payload: any) => {
      return apiClient.post("/user-exams/submit-all-answers", payload);
    },
    onSuccess: () => {
      router.push("/profile");
    },
  });

  // Prepare answers for submission
  const prepareAnswers = () => {
    const allQuestions = [...modelAQuestions, ...modelBQuestions];
    // Use selectedRef.current instead of selected to get the latest values
    const answers = allQuestions
      .filter((q) => selectedRef.current[q.id])
      .map((q) => {
        const answer = selectedRef.current[q.id];

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
      has_cheated: false,
      answers,
    };
  };

  // COMMENTED OUT: Handle exam submission due to cheating
  // const handleCheatingSubmit = () => {
  //   if (!userExamId) {
  //     console.error("No user_exam_id available for submission");
  //     return;
  //   }

  //   // Use the ref to get the latest answers
  //   const allQuestions = [...modelAQuestions, ...modelBQuestions];
  //   const answers = allQuestions
  //     .filter((q) => selectedRef.current[q.id])
  //     .map((q) => {
  //       const answer = selectedRef.current[q.id];

  //       if (q.type === "mcq") {
  //         return {
  //           user_exam_question_id: q.id,
  //           answer_id: parseInt(answer),
  //         };
  //       } else {
  //         return {
  //           user_exam_question_id: q.id,
  //           answer_text: answer,
  //         };
  //       }
  //     });

  //   const payload = {
  //     user_exam_id: userExamId,
  //     has_cheated: true,
  //     cheating_reason: isInFullscreen
  //       ? "Student out the full screen"
  //       : "The student open another tab",
  //     answers, // Now includes the actual answers
  //   };

  //   submitExamMutation.mutate(payload);
  // };

  // COMMENTED OUT: Use the proctoring hook
  // const { showWarning, countdown, isInFullscreen, hasFocus, isTimerActive } =
  //   useExamProctor({
  //     onViolationTimeout: handleCheatingSubmit,
  //     isEnabled: examStarted,
  //   });

  // Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: () => apiClient.post("/user-exams/enroll", { exam_id: examId }),
  });

  // Start Exam Mutation - this now returns the questions
  const startExamMutation = useMutation<ExamStartResponse, Error, number>({
    mutationFn: (userExamId: number) =>
      apiClient.post(`/user-exams/${userExamId}/start`, {
        exam_id: examId,
      }),
    onSuccess: (response) => {
      // Calculate total time and divide by 2 for each module
      const startTime = new Date(response.data.user_exam.start_time);
      const endTime = new Date(response.data.user_exam.end_time);
      const currentTime = new Date();
      const totalSeconds = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000
      );

      // Store total exam time and set half for first module
      setTotalExamTime(totalSeconds);
      const halfTime = Math.floor(totalSeconds / 2);
      setTimeLeft(halfTime);
      setExamStarted(true);
    },
    onError: (error) => {
      console.error("Start exam error:", error);
      // Fallback to 35 minutes total (17.5 minutes per module)
      setTotalExamTime(35 * 60);
      setTimeLeft(Math.floor((35 * 60) / 2));
      setExamStarted(true);
    },
  });

  // Get exam questions from the start exam response
  const modelAQuestions =
    startExamMutation.data?.data?.user_exam?.models?.model_a?.questions || [];
  const modelBQuestions =
    startExamMutation.data?.data?.user_exam?.models?.model_b?.questions || [];

  const questions =
    currentModule === "model_a" || currentModule === "review_a"
      ? modelAQuestions
      : modelBQuestions;

  // Initial enrollment and start
  useEffect(() => {
    if (examId && !userExamId) {
      enrollMutation.mutate(undefined, {
        onSuccess: (response) => {
          const enrollUserExamId = response?.data?.user_exam_id;

          if (enrollUserExamId) {
            setUserExamId(enrollUserExamId);
            startExamMutation.mutate(enrollUserExamId);
          } else {
          }
        },
        onError: (error) => {
          console.error("Enroll error:", error);
        },
      });
    }
  }, [examId]);

  // TIMER LOGIC
  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft <= 0) {
      if (currentModule === "model_a") {
        // Time up for Module A - go directly to Module B
        setModuleALocked(true);
        setCurrentModule("model_b");
        setCurrent(0);
        setTimeLeft(Math.floor(totalExamTime / 2)); // Reset timer for Module B
      } else if (currentModule === "model_b") {
        // Time up for Module B - submit exam
        setModuleBLocked(true);
        handleSubmitExam();
      }
      return;
    }
    const timer = setInterval(
      () => setTimeLeft((prev) => Math.max(0, prev! - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft, currentModule, totalExamTime]);

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
      has_cheated: false,
    };
    submitExamMutation.mutate(payload);
  };

  // Loading state
  if (enrollMutation.isPending || startExamMutation.isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            Starting exam…
          </div>
          <div className="text-sm text-gray-500 mt-2">Please wait</div>
        </div>
      </div>
    );
  }

  // Error state
  if (enrollMutation.isError || startExamMutation.isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="text-lg font-medium text-red-600">
            Failed to start exam
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
  const moduleTime = Math.floor(totalExamTime / 2);
  const progressPercentage =
    ((moduleTime - (timeLeft || 0)) / moduleTime) * 100;

  const isEndOfModuleA =
    currentModule === "model_a" && current === modelAQuestions.length - 1;
  const isEndOfModuleB =
    currentModule === "model_b" && current === modelBQuestions.length - 1;

  const handleNext = () => {
    if (isEndOfModuleA && !showReview) {
      setShowReview(true);
      setCurrentModule("review_a");
    } else if (showReview && currentModule === "review_a") {
      setShowReview(false);
      setCurrentModule("model_b");
      setCurrent(0);
      setTimeLeft(Math.floor(totalExamTime / 2)); // Reset timer to half for module B
      setModuleALocked(true);
    } else if (isEndOfModuleB && !showReview) {
      setShowReview(true);
      setCurrentModule("review_b");
    } else if (showReview && currentModule === "review_b") {
      // Submit exam after Module B review
      handleSubmitExam();
    } else {
      setCurrent((c) => Math.min(questions.length - 1, c + 1));
    }
  };

  const handleReviewBack = () => {
    if (currentModule === "review_a" && !moduleALocked) {
      setShowReview(false);
      setCurrentModule("model_a");
    } else if (currentModule === "review_b" && !moduleBLocked) {
      setShowReview(false);
      setCurrentModule("model_b");
    }
  };

  const handleQuestionClick = (index: number) => {
    if (currentModule === "review_a" && !moduleALocked) {
      setCurrent(index);
      setShowReview(false);
      setCurrentModule("model_a");
    } else if (currentModule === "review_b" && !moduleBLocked) {
      setCurrent(index);
      setShowReview(false);
      setCurrentModule("model_b");
    }
  };

  // Show review screen
  if (showReview) {
    const isModuleA = currentModule === "review_a";
    const reviewQuestions = isModuleA ? modelAQuestions : modelBQuestions;
    const moduleLocked = isModuleA ? moduleALocked : moduleBLocked;

    return (
      <ReviewScreen
        examData={startExamMutation.data}
        flagged={flagged}
        handleNext={handleNext}
        handleQuestionClick={handleQuestionClick}
        handleReviewBack={handleReviewBack}
        modelAQuestions={reviewQuestions}
        moduleALocked={moduleLocked}
        selected={selected}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* HEADER */}
      <ActiveExamHeader
        currentModule={currentModule}
        examData={startExamMutation.data}
        // COMMENTED OUT: Proctoring props
        // hasFocus={hasFocus}
        // isInFullscreen={isInFullscreen}
        setShowCalculator={setShowCalculator}
        formatTime={formatTime}
        showCalculator={showCalculator}
        timeLeft={timeLeft}
        setHelpSheet={setHelpSheet}
        showHelpSheet={showHelpSheet}
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
                  onClick={handleNext}
                  className="gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Review
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
      <div className="relative">
        <NavigationPopover
          currentModule={currentModule}
          moduleALocked={moduleALocked}
          moduleBLocked={moduleBLocked}
          modelAQuestions={modelAQuestions}
          modelBQuestions={modelBQuestions}
          setCurrent={setCurrent}
          setShowReview={setShowReview}
          setCurrentModule={setCurrentModule}
        />
        <ExamFooter
          current={current}
          currentModule={currentModule}
          questions={questions}
        />
      </div>
      {/* DESMOS CALCULATOR MODAL */}
      {showCalculator && (
        <DesmosCalculator setShowCalculator={setShowCalculator} />
      )}

      {/* COMMENTED OUT: PROCTORING WARNING DIALOG */}
      {/* <ErrorDialog
        countdown={countdown}
        hasFocus={hasFocus}
        isInFullscreen={isInFullscreen}
        showWarning={showWarning}
      /> */}
    </div>
  );
}
