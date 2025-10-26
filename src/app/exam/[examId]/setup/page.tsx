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
import { ArrowRight, BookOpen, Clock } from "lucide-react";
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

  const [countdown, setCountdown] = useState(15);

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
  console.log({ examData });

  // Calculate total questions
  const modelAQuestions = examData.model_a?.questions?.length || 0;
  const modelBQuestions = Object.keys(examData.model_b?.questions || {}).length;
  const totalQuestions = modelAQuestions + modelBQuestions;

  // Calculate total marks
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Exam Setup</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8">
          <h1 className="text-4xl font-semibold">Mathematics Exam</h1>

          <Card>
            <CardHeader>
              <CardTitle>Exam Overview</CardTitle>
              <CardDescription>
                Review the exam details before you begin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Models</div>
                    <div className="text-xl font-semibold">2</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Questions
                    </div>
                    <div className="text-xl font-semibold">
                      {totalQuestions}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Marks
                    </div>
                    <div className="text-xl font-semibold">{totalMarks}</div>
                  </div>
                </div>
              </div>
              <CheatingAlerts />
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-3">
            {countdown > 0 ? (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Please read the cheating cases carefully before starting the
                  exam.
                </p>
                <Button size="lg" className="gap-2 px-8" disabled>
                  Start Exam in {countdown}s
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                className="gap-2 px-8"
                onClick={handleStartExam}
              >
                Start Exam
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
