"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ✅ Types
export type Exam = {
  id: number;
  subject: string;
  duration: number;
  total_marks: number;
  number_of_questions: number;
  number_of_students: number;
  status: "upcoming" | "active" | "completed";
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

export type ExamsResponse = {
  status: string;
  message: string;
  data: Exam[];
};

// ✅ Fetch exams using your global API client
async function fetchExams(): Promise<Exam[]> {
  const res = await apiClient.get<ExamsResponse>("/exams/all");
  return res.data;
}

export default function ExamSection() {
  const router = useRouter();
  const {
    data: exams = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchExams,
  });

  const handleStartExam = (examId: number) => {
    router.push(`/exam/${examId}/setup`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {(error as Error).message || "Something went wrong."}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        No exams available right now.
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exams
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .filter((exam) => exam.status !== "active")
        .map((exam) => (
          <Card key={exam.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{exam.subject}</CardTitle>
                  <CardDescription className="mt-1">
                    {exam.total_marks} total marks
                  </CardDescription>
                </div>

                {exam.status === "completed" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}

                {exam.status === "active" && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    In Progress
                  </Badge>
                )}

                {exam.status === "upcoming" && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Upcoming
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{exam.number_of_questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{exam.duration} minutes</span>
                </div>
              </div>
              <Button
                variant={exam.status === "active" ? "default" : "outline"}
                asChild
              >
                <Link
                  href={`/exam/${exam.id}/setup`}
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full"
                >
                  {exam.status === "active" ? "Continue Exam" : "Start Exam"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
