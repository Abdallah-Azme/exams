import React, { useState } from "react";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavigationPopoverProps {
  currentModule: "model_a" | "model_b" | "review_a" | "review_b";
  moduleALocked: boolean;
  moduleBLocked: boolean;
  modelAQuestions: any[];
  modelBQuestions: any[];
  setCurrent: (index: number) => void;
  setShowReview: (show: boolean) => void;
  setCurrentModule: (
    module: "model_a" | "model_b" | "review_a" | "review_b"
  ) => void;
}

export default function NavigationPopover({
  currentModule,
  moduleALocked,
  moduleBLocked,
  modelAQuestions,
  modelBQuestions,
  setCurrent,
  setShowReview,
  setCurrentModule,
}: NavigationPopoverProps) {
  const [open, setOpen] = useState(false);

  // Debug: log the values
  console.log("NavigationPopover render:", {
    currentModule,
    moduleALocked,
    moduleBLocked,
    modelAQuestionsLength: modelAQuestions?.length,
    modelBQuestionsLength: modelBQuestions?.length,
  });

  // Only show if we're in a locked module and in question view (not review)
  const shouldShow =
    (currentModule === "model_a" && moduleALocked) ||
    (currentModule === "model_b" && moduleBLocked);

  console.log("shouldShow:", shouldShow);

  const isModuleA = currentModule === "model_a";
  const questions = isModuleA ? modelAQuestions : modelBQuestions;

  const handleGoToReview = () => {
    setShowReview(true);
    setCurrentModule(isModuleA ? "review_a" : "review_b");
    setOpen(false);
  };

  const handleQuestionClick = (index: number) => {
    setCurrent(index);
    setOpen(false);
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-10 h-10 p-0 shadow-lg border-2 border-blue-600 bg-white hover:bg-blue-50 transition-all"
            title="Navigation Menu"
          >
            <Navigation className="w-5 h-5 text-blue-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center" sideOffset={8}>
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-900">
                Module Navigation
              </h3>
              <p className="text-xs text-gray-600">
                This module is locked. Jump to any question or return to review.
              </p>
            </div>

            {/* Go to Review Button */}
            <Button
              onClick={handleGoToReview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Go to Review Page
            </Button>

            {/* Question Grid */}
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-gray-700 mb-3">
                Jump to Question:
              </p>
              <div className="max-h-[200px] overflow-y-auto pr-2">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question: any, index: number) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(index)}
                      className="w-full aspect-square flex items-center justify-center rounded border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 font-semibold text-sm text-gray-700 hover:text-blue-600 transition-all"
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
