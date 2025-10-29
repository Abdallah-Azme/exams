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
import CheatingAlerts from "@/src/modules/exams/ui/cheating-alerts";
import { apiClient } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Lock,
  Trophy,
  AlertCircle,
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

  const modelAQuestions = examData.model_a?.questions?.length || 0;
  const modelBQuestions = Object.keys(examData.model_b?.questions || {}).length;
  const totalQuestions = modelAQuestions + modelBQuestions;

  const modelAMarks =
    examData.model_a?.questions?.reduce((sum, q) => sum + q.marks, 0) || 0;
  const modelBMarks =
    Object.values(examData.model_b?.questions || {}).reduce(
      (sum, q) => sum + q.marks,
      0
    ) || 0;
  const totalMarks = modelAMarks + modelBMarks;

  const handleStartExam = () => {
    router.push(`/exam/${examId}/take`);
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
                <p className="text-sm text-gray-600 text-center max-w-md">
                  You're all set! Click the button below to begin your exam.
                </p>
                <Button
                  size="lg"
                  className="gap-2 px-12 py-6 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleStartExam}
                >
                  Start Exam
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
