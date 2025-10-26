"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { apiClient } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2, ShieldQuestionIcon } from "lucide-react";
import { useState } from "react";

type AssistanceResponse = {
  status: string;
  type: string;
  rich_text: string;
};

async function fetchAssistance(): Promise<AssistanceResponse> {
  const response = await apiClient.post<AssistanceResponse>(
    "/exams/assistance"
  );
  return response;
}

export function AssistanceSheet() {
  const [open, setOpen] = useState(false);

  const {
    data: assistance,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["exam-assistance"],
    queryFn: fetchAssistance,
    enabled: open,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldQuestionIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Exam Assistance</SheetTitle>
          <SheetDescription>
            Important rules and information for the exam
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load assistance"}
              </AlertDescription>
            </Alert>
          )}

          {assistance && !isLoading && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: assistance.rich_text }}
            />
          )}

          {!assistance && !isLoading && !isError && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No assistance available at the moment</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
