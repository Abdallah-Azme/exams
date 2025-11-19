"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Trophy, Clock, Loader2, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { apiClient } from "@/src/utils";

type ExamStats = {
  total_questions: number;
  recently_used_count: number;
  unused_count: number;
  most_used_questions: Record<string, number>;
};

type ExamData = {
  exam_id: number;
  exam_title: string;
  total_score: number;
  percentage: string;
  submitted_at: string;
  stats: ExamStats;
};

type ApiResponse = {
  status: string;
  message: string;
  data: ExamData[];
};

async function fetchUserExamsStats(): Promise<ExamData[]> {
  const response = await apiClient.get<ApiResponse>(
    "/user-exams/all-distribution-stats"
  );
  return response.data;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useStore((state) => state.user);

  const {
    data: exams = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-exams-stats"],
    queryFn: fetchUserExamsStats,
  });

  const totalExams = exams.length;
  const averageScore =
    exams.length > 0
      ? (
          exams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0) /
          exams.length
        ).toFixed(1)
      : "0.0";
  const lastExam = exams[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
            <CardDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load exam data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-semibold text-blue-500 hover:underline hover:text-blue-400"
            >
              Demo book Exam
            </Link>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              useStore.getState().setUser(null);
              router.push("/signin");
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Welcome, {user?.name ?? "Student"}
            </CardTitle>
            <CardDescription>
              {user?.email ?? "student@example.com"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Exams</p>
                  <p className="text-lg font-medium">{totalExams}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-lg font-medium">{averageScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Exam</p>
                  <p className="text-lg font-medium">
                    {lastExam?.exam_title ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-lg font-medium">
                    {lastExam?.stats.total_questions ?? 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Exam History</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : exams.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No exams found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam, index) => {
                const percentage = parseFloat(exam.percentage);
                const scaledScore = Math.round((percentage / 100) * 1600);

                return (
                  <Card
                    key={`${exam.exam_id}-${index}`}
                    className="overflow-hidden"
                  >
                    {/* Header with dark blue background */}
                    <div className="bg-[#0A4A6E] text-white p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold">EXAM</h3>
                      </div>
                      <div className="bg-[#0D5F8C] rounded px-3 py-2 flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {exam.exam_title.toUpperCase()}
                        </span>
                        <span className="text-sm">
                          {formatDate(exam.submitted_at)}
                        </span>
                      </div>
                    </div>

                    {/* Score Section */}
                    <CardContent className="p-6 bg-gradient-to-b from-gray-50 to-white">
                      <div className="text-center mb-6">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          YOUR TOTAL SCORE
                        </p>
                        <p className="text-6xl font-bold mb-2">
                          {exam.total_score}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
