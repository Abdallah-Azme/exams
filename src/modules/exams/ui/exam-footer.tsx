"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function ExamFooter({ current, currentModule, questions }: any) {
  // TODO fetch user data
  //   const {} = useQuery();
  return (
    <footer className="text-xs text-center text-gray-400 border-t py-5">
      Mathematics Exam • Module{" "}
      {currentModule === "model_a" || currentModule === "review_a" ? "1" : "2"}{" "}
      • Question {current + 1} of {questions.length}
    </footer>
  );
}
