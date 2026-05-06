import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/utils";

export type ExamSummaryDetail = {
  question_id: number;
  question_text: string;
  is_correct: boolean;
  correct_answer: string;
  student_answer: string;
  explanation: string | null;
};

export type ExamSummaryData = {
  user_exam_id: number;
  exam_id: number;
  student_id: number;
  status: string;
  total_questions: number;
  answered_questions: number;
  correct_questions: number;
  wrong_questions: number;
  unanswered_questions: number;
  total_points: number;
  earned_points: number;
  percentage: string;
  final_score: null | number;
  submitted_at: null | string;
  details: ExamSummaryDetail[];
};

export type ExamSummaryResponse = {
  status: string;
  message: string;
  data: ExamSummaryData;
};

export async function fetchUserExamSummary(userExamId: number): Promise<ExamSummaryData> {
  const response = await apiClient.get<ExamSummaryResponse>(
    `/user-exams/${userExamId}/summary`
  );
  return response.data;
}

export function useUserExamSummary(userExamId: number | undefined) {
  return useQuery({
    queryKey: ["user-exam-summary", userExamId],
    queryFn: () => fetchUserExamSummary(userExamId!),
    enabled: !!userExamId,
  });
}
