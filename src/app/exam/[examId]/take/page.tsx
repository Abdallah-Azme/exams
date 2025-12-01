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

// localStorage helper functions
const getStorageKey = (examId: string | string[] | undefined, key: string) => {
  if (!examId) return null;
  return `exam_${examId}_${key}`;
};

const getStoredTime = (
  examId: string | string[] | undefined,
  key: string
): Date | null => {
  if (typeof window === "undefined") return null;
  const storageKey = getStorageKey(examId, key);
  if (!storageKey) return null;
  const stored = localStorage.getItem(storageKey);
  return stored ? new Date(stored) : null;
};

const setStoredTime = (
  examId: string | string[] | undefined,
  key: string,
  time: Date
) => {
  if (typeof window === "undefined") return;
  const storageKey = getStorageKey(examId, key);
  if (!storageKey) return;
  localStorage.setItem(storageKey, time.toISOString());
};

const getStoredNumber = (
  examId: string | string[] | undefined,
  key: string
): number | null => {
  if (typeof window === "undefined") return null;
  const storageKey = getStorageKey(examId, key);
  if (!storageKey) return null;
  const stored = localStorage.getItem(storageKey);
  return stored ? parseInt(stored, 10) : null;
};

const setStoredNumber = (
  examId: string | string[] | undefined,
  key: string,
  value: number
) => {
  if (typeof window === "undefined") return;
  const storageKey = getStorageKey(examId, key);
  if (!storageKey) return;
  localStorage.setItem(storageKey, value.toString());
};

const clearExamStorage = (examId: string | string[] | undefined) => {
  if (typeof window === "undefined") return;
  const keys = [
    "start_time",
    "module_a_start_time",
    "module_b_start_time",
    "total_duration",
    "module_duration",
  ];
  keys.forEach((key) => {
    const storageKey = getStorageKey(examId, key);
    if (storageKey) localStorage.removeItem(storageKey);
  });
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
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [moduleAStartTime, setModuleAStartTime] = useState<Date | null>(null);
  const [moduleBStartTime, setModuleBStartTime] = useState<Date | null>(null);

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
      router.replace("/profile");
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
      // Get server times
      const serverStartTime = new Date(response.data.user_exam.start_time);
      const serverEndTime = new Date(response.data.user_exam.end_time);
      const currentTime = new Date();

      // Calculate total duration from server times
      let totalSeconds = Math.floor(
        (serverEndTime.getTime() - serverStartTime.getTime()) / 1000
      );

      // 🧪 TEST MODE: Override duration to 10 seconds for testing
      const TEST_MODE = false; // Set to false for production
      if (TEST_MODE) {
        console.warn("⚠️ TEST MODE ENABLED - Exam duration set to 10 seconds");
        totalSeconds = 10;
      }

      const moduleDuration = Math.floor(totalSeconds / 2);

      // Calculate elapsed time since exam started
      const elapsedTotal = Math.floor(
        (currentTime.getTime() - serverStartTime.getTime()) / 1000
      );
      const remainingTotal = Math.max(0, totalSeconds - elapsedTotal);

      // Store in localStorage
      setStoredTime(examId, "start_time", serverStartTime);
      setStoredNumber(examId, "total_duration", totalSeconds);
      setStoredNumber(examId, "module_duration", moduleDuration);

      // CRITICAL: Check if exam has already expired BEFORE setting any state
      // This handles cases where user starts late or the server returns an expired exam
      if (remainingTotal <= 0) {
        console.warn("Exam time has already expired - submitting immediately");
        // Set userExamId first so handleSubmitExam can use it
        const userExamIdValue = response.data.user_exam.id;
        setUserExamId(userExamIdValue);
        // Use setTimeout to ensure state is updated before submission
        setTimeout(() => {
          const allQuestions = [
            ...(response.data.user_exam.models.model_a.questions || []),
            ...(response.data.user_exam.models.model_b.questions || []),
          ];
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

          const payload = {
            user_exam_id: userExamIdValue,
            has_cheated: false,
            answers,
          };

          clearExamStorage(examId);
          submitExamMutation.mutate(payload);
        }, 0);
        return;
      }

      // Store Module A start time (use server start time or current time)
      const moduleAStart =
        getStoredTime(examId, "module_a_start_time") || currentTime;
      if (!getStoredTime(examId, "module_a_start_time")) {
        setStoredTime(examId, "module_a_start_time", moduleAStart);
      }

      // Calculate remaining time for Module A
      const elapsedModuleA = Math.floor(
        (currentTime.getTime() - moduleAStart.getTime()) / 1000
      );
      const remainingModuleA = Math.max(0, moduleDuration - elapsedModuleA);

      // Use minimum of remaining module time and remaining total time
      const timeToDisplay = Math.min(remainingModuleA, remainingTotal);

      // Update state
      setExamStartTime(serverStartTime);
      setModuleAStartTime(moduleAStart);
      setTotalExamTime(totalSeconds);
      setTimeLeft(timeToDisplay);
      setExamStarted(true);
    },
    onError: (error) => {
      console.error("Start exam error:", error);
      // Fallback to 35 minutes total (17.5 minutes per module)
      const fallbackTotal = 35 * 60;
      const fallbackModule = Math.floor(fallbackTotal / 2);
      const now = new Date();

      setStoredTime(examId, "start_time", now);
      setStoredTime(examId, "module_a_start_time", now);
      setStoredNumber(examId, "total_duration", fallbackTotal);
      setStoredNumber(examId, "module_duration", fallbackModule);

      setExamStartTime(now);
      setModuleAStartTime(now);
      setTotalExamTime(fallbackTotal);
      setTimeLeft(fallbackModule);
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

  // Restore timer state from localStorage on mount/refresh
  useEffect(() => {
    if (!examStarted || !examId) return;

    const storedExamStart = getStoredTime(examId, "start_time");
    const storedTotalDuration = getStoredNumber(examId, "total_duration");
    const storedModuleDuration = getStoredNumber(examId, "module_duration");

    if (!storedExamStart || !storedTotalDuration || !storedModuleDuration)
      return;

    const now = new Date();
    const elapsedTotal = Math.floor(
      (now.getTime() - storedExamStart.getTime()) / 1000
    );
    const remainingTotal = Math.max(0, storedTotalDuration - elapsedTotal);

    // Check if total exam time has expired
    if (remainingTotal <= 0) {
      console.warn("Exam time expired - auto submitting");
      handleSubmitExam();
      return;
    }

    // Determine which module we're in and calculate remaining time
    const storedModuleBStart = getStoredTime(examId, "module_b_start_time");

    if (storedModuleBStart && currentModule === "model_b") {
      // We're in Module B
      const elapsedModuleB = Math.floor(
        (now.getTime() - storedModuleBStart.getTime()) / 1000
      );
      const remainingModuleB = Math.max(
        0,
        storedModuleDuration - elapsedModuleB
      );
      const timeToDisplay = Math.min(remainingModuleB, remainingTotal);
      setTimeLeft(timeToDisplay);
      setModuleBStartTime(storedModuleBStart);
    } else {
      // We're in Module A
      const storedModuleAStart = getStoredTime(examId, "module_a_start_time");
      if (storedModuleAStart) {
        const elapsedModuleA = Math.floor(
          (now.getTime() - storedModuleAStart.getTime()) / 1000
        );
        const remainingModuleA = Math.max(
          0,
          storedModuleDuration - elapsedModuleA
        );
        const timeToDisplay = Math.min(remainingModuleA, remainingTotal);
        setTimeLeft(timeToDisplay);
        setModuleAStartTime(storedModuleAStart);
      }
    }

    setExamStartTime(storedExamStart);
    setTotalExamTime(storedTotalDuration);
  }, [examStarted, examId]);

  // TIMER LOGIC - Refactored for reliability
  useEffect(() => {
    if (!examStarted || !examStartTime || !totalExamTime) return;

    // Calculate and update time remaining
    const updateTimer = () => {
      const now = new Date();
      const elapsedTotal = Math.floor(
        (now.getTime() - examStartTime.getTime()) / 1000
      );

      // Check if total exam time has expired (priority check)
      if (elapsedTotal >= totalExamTime) {
        console.warn("Total exam time expired - auto submitting");
        setTimeLeft(0);
        handleSubmitExam();
        return false; // Stop timer
      }

      const remainingTotal = Math.max(0, totalExamTime - elapsedTotal);
      const moduleDuration = Math.floor(totalExamTime / 2);

      // Calculate remaining time for current module
      if (currentModule === "model_a") {
        const moduleAStart = moduleAStartTime || examStartTime;
        const elapsedModuleA = Math.floor(
          (now.getTime() - moduleAStart.getTime()) / 1000
        );
        const remainingModuleA = Math.max(0, moduleDuration - elapsedModuleA);

        // Check if Module A time has expired
        if (remainingModuleA <= 0 && !moduleALocked) {
          setModuleALocked(true);
          setCurrentModule("model_b");
          setCurrent(0);

          // Store Module B start time
          const moduleBStart = new Date();
          setStoredTime(examId, "module_b_start_time", moduleBStart);
          setModuleBStartTime(moduleBStart);

          // Set time for Module B
          const timeForModuleB = Math.min(moduleDuration, remainingTotal);
          setTimeLeft(timeForModuleB);
          return true; // Continue timer
        }

        const timeToDisplay = Math.min(remainingModuleA, remainingTotal);
        setTimeLeft(timeToDisplay);
      } else if (currentModule === "model_b") {
        const moduleBStart = moduleBStartTime || examStartTime;
        const elapsedModuleB = Math.floor(
          (now.getTime() - moduleBStart.getTime()) / 1000
        );
        const remainingModuleB = Math.max(0, moduleDuration - elapsedModuleB);

        // Check if Module B time has expired
        if (remainingModuleB <= 0 && !moduleBLocked) {
          setModuleBLocked(true);
          setTimeLeft(0);
          handleSubmitExam();
          return false; // Stop timer
        }

        const timeToDisplay = Math.min(remainingModuleB, remainingTotal);
        setTimeLeft(timeToDisplay);
      }

      return true; // Continue timer
    };

    // Initial update
    updateTimer();

    // Set up interval to update every second
    const timer = setInterval(() => {
      const shouldContinue = updateTimer();
      if (!shouldContinue) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    examStarted,
    examStartTime,
    totalExamTime,
    currentModule,
    moduleAStartTime,
    moduleBStartTime,
    moduleALocked,
    moduleBLocked,
    examId,
  ]);

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

    // Clear localStorage for this exam
    clearExamStorage(examId);

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
      setModuleALocked(true);

      // Store Module B start time and calculate remaining time
      const now = new Date();
      setStoredTime(examId, "module_b_start_time", now);
      setModuleBStartTime(now);

      // Calculate remaining time for Module B
      const moduleDuration =
        getStoredNumber(examId, "module_duration") ||
        Math.floor(totalExamTime / 2);
      const storedExamStart =
        getStoredTime(examId, "start_time") || examStartTime;

      if (storedExamStart) {
        const elapsedTotal = Math.floor(
          (now.getTime() - storedExamStart.getTime()) / 1000
        );
        const remainingTotal = Math.max(0, totalExamTime - elapsedTotal);
        const timeForModuleB = Math.min(moduleDuration, remainingTotal);
        setTimeLeft(timeForModuleB);
      } else {
        setTimeLeft(moduleDuration);
      }
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
