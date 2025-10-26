import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import React from "react";

interface ErrorDialogProps {
  hasFocus: boolean;
  isInFullscreen: boolean;
  showWarning: boolean;
  countdown: number;
}

export default function ErrorDialog({
  hasFocus,
  isInFullscreen,
  showWarning,
  countdown,
}: ErrorDialogProps) {
  // Trigger fullscreen mode
  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error trying to enter fullscreen:", err);
      });
    }
  };

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl border-4 border-red-600 shadow-2xl shadow-red-500/50">
        <div className="bg-gradient-to-br from-red-50 to-red-100 -mx-6 -mt-6 px-6 pt-6 pb-8 rounded-t-lg border-b-4 border-red-600">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-3 text-red-700 text-2xl">
              <div className="animate-bounce">
                <span className="text-5xl drop-shadow-lg">⚠️</span>
              </div>
              <span className="font-bold">SECURITY VIOLATION DETECTED</span>
            </DialogTitle>
            <DialogDescription className="text-center text-lg pt-6 text-red-800 font-semibold">
              You have exited fullscreen mode or the exam has lost focus.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-6 pt-6 pb-2">
          {/* Countdown Timer */}
          <div className="text-center">
            <div className="text-gray-700 text-sm font-medium mb-3 uppercase tracking-wide">
              Time Remaining to Return
            </div>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-xl border-4 border-red-800 animate-pulse">
              <span className="text-6xl font-bold text-white tabular-nums">
                {countdown}
              </span>
            </div>
            <div className="mt-4 text-red-700 font-bold text-lg">
              Exam will be auto-submitted if you don't return!
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="w-full h-4 bg-red-200 rounded-full overflow-hidden shadow-inner border-2 border-red-300">
              <div
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 h-full transition-all duration-200 ease-linear shadow-lg"
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                isInFullscreen
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500 animate-pulse"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isInFullscreen
                      ? "bg-green-500 border-green-600"
                      : "bg-red-500 border-red-600"
                  }`}
                >
                  <span className="text-white font-bold text-sm">
                    {isInFullscreen ? "✓" : "✗"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800">
                    Fullscreen Status
                  </div>
                  <div
                    className={`text-xs ${
                      isInFullscreen ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isInFullscreen ? "Restored" : "Return to fullscreen (F11)"}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                hasFocus
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500 animate-pulse"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    hasFocus
                      ? "bg-green-500 border-green-600"
                      : "bg-red-500 border-red-600"
                  }`}
                >
                  <span className="text-white font-bold text-sm">
                    {hasFocus ? "✓" : "✗"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800">
                    Window Focus
                  </div>
                  <div
                    className={`text-xs ${
                      hasFocus ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {hasFocus ? "Restored" : "Click on this window"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 Big Fullscreen Button */}
          {!isInFullscreen && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={enterFullscreen}
                className="relative flex items-center gap-3 px-10 py-5 text-2xl font-extrabold text-white bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl shadow-2xl hover:scale-105 transition-transform animate-pulse"
              >
                <Maximize2 className="w-7 h-7" />
                ENTER FULLSCREEN MODE
              </Button>
            </div>
          )}

          {/* Success Message */}
          {isInFullscreen && hasFocus && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center font-bold text-lg shadow-lg animate-pulse">
              ✓ All conditions met! Resuming exam...
            </div>
          )}

          {/* Warning Message */}
          {(!isInFullscreen || !hasFocus) && (
            <div className="bg-red-600 text-white p-4 rounded-lg text-center">
              <div className="font-bold text-base mb-1">⚠️ ACTION REQUIRED</div>
              <div className="text-sm">
                Return to fullscreen mode AND click on this window to continue
                your exam
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
