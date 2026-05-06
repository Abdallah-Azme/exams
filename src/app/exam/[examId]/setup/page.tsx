"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CheatingAlerts from "@/src/modules/exams/ui/cheating-alerts";
import { apiClient } from "@/src/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Lock,
  Trophy,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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

type ExamDetails = {
  password?: string;
  model_a: {
    name: string;
    questions: Question[];
  };
  model_b: {
    name: string;
    questions: Record<string, Question>;
  };
};

const fetchExam = async (examId: string) => {
  return await apiClient.get(`/exams/one/${examId}`);
};

const fetchRules = async () => {
  const x = await apiClient.post(`/exams/assistance`);
  return x;
};

export default function ExamSetupPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [countdown, setCountdown] = useState(5);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => fetchExam(examId),
    enabled: !!examId,
  });

  const {
    data: rulesData,
    isLoading: isRulesLoading,
    isError: isRulesError,
  } = useQuery({
    queryKey: ["assistance", examId],
    queryFn: () => fetchRules(),
    enabled: !!examId,
  });

  const checkPasswordMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiClient.post("/exams/check-password", {
        exam_id: Number(examId),
        password: pwd,
      });
      return res; // ofetch returns the JSON payload directly
    },
    onSuccess: (responseData) => {
      if (responseData?.data === true || responseData === true) {
        // Set an auth flag so the user can't bypass this page by typing the URL directly
        sessionStorage.setItem(`exam_auth_${examId}`, "true");
        router.push(`/exam/${examId}/take`);
      } else {
        // Overriding the backend message ("false") with a more suitable message
        toast.error("Invalid Exam Password. Please check with your administrator.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "An error occurred while verifying the password.");
    },
  });

  if (isLoading || isRulesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading exam details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">
          Failed to load exam details.
        </div>
      </div>
    );
  }

  const examData: ExamDetails = data?.data?.data || {};

  const modelAMarks =
    examData.model_a?.questions?.reduce((sum, q) => sum + q.marks, 0) || 0;
  const modelBMarks =
    Object.values(examData.model_b?.questions || {}).reduce(
      (sum, q) => sum + q.marks,
      0
    ) || 0;
  const totalMarks = modelAMarks + modelBMarks;


  const handleStartExam = () => {
    // If the user typed a password or if it's required, we check it
    if (!password) {
      toast.error("Please enter the exam password to begin.");
      return;
    }

    checkPasswordMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Exam Setup</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Practice Test</h1>
            <p className="text-lg text-gray-600">Mathematics Exam</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardContent className="p-8 space-y-6">
              {/* Timing */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">Timing</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Practice tests are timed, but you can pause them. To
                    continue on another device, you have to start over. We
                    delete incomplete practice tests after 90 days.
                  </p>
                </div>
              </div>

              {/* Scores */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">Scores</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    When you finish the practice test, go to{" "}
                    <span className="font-semibold">My Practice</span> to see
                    your scores and get personalized study tips.
                  </p>
                </div>
              </div>

              {/* Assistive Technology */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">
                    Assistive Technology (AT)
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Be sure to practice with any AT you use for testing. If you
                    configure your AT settings here, you may need to repeat this
                    step on test day.
                  </p>
                </div>
              </div>

              {/* No Device Lock */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">
                    No Device Lock
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We don't lock your device during practice. On test day,
                    you'll be blocked from using other programs or apps.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-4">
            {countdown > 0 ? (
              <>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Please read the exam guidelines carefully before starting.
                  Make sure you understand all the rules and requirements.
                </p>
                <Button
                  size="lg"
                  className="gap-2 px-12 py-6 text-lg font-semibold rounded-full"
                  disabled
                >
                  Start Exam in {countdown}s
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2 text-center max-w-md w-full">
                  <h3 className="text-xl font-semibold text-gray-900">Secure Exam Area</h3>
                  <p className="text-sm text-gray-500">
                    This exam is protected. Please enter the password provided by your administrator to begin.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-4">
                  <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter exam password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className="pl-12 pr-12 py-6 text-lg rounded-2xl border-gray-200 focus-visible:ring-blue-500 focus-visible:ring-2 shadow-sm transition-all"
                      disabled={checkPasswordMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm font-medium text-red-600 bg-red-50 px-4 py-1.5 rounded-full">
                      {passwordError}
                    </p>
                  )}
                </div>

                <Button
                  size="lg"
                  className="gap-2 px-12 py-6 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleStartExam}
                  disabled={checkPasswordMutation.isPending}
                >
                  {checkPasswordMutation.isPending ? "Verifying..." : "Start Exam"}
                  {!checkPasswordMutation.isPending && <ArrowRight className="h-5 w-5" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
