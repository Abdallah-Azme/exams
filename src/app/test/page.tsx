"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * ExamProctor
 * - Shows a Dialog warning when the page loses focus or is not "fullscreen".
 * - Starts a 10s countdown. If the student returns (both focus + fullscreen) within 10s -> everything is OK.
 * - If they don't return within 10s -> redirect to /cheating-detected.
 *
 * Notes:
 * - Uses both Fullscreen API detection and a window-size fallback (to detect F11 browser fullscreen).
 * - Uses visibilitychange as an additional signal.
 */

export default function ExamProctor() {
  const router = useRouter();

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isInFullscreen, setIsInFullscreen] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(true);

  // refs
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const showingRef = useRef<boolean>(false); // mirrors showWarning but synchronous
  const recoveringRef = useRef<boolean>(false);

  // ---------- Helpers ----------
  const isActuallyFocused = () => {
    // document.hasFocus is usually reliable
    return typeof document !== "undefined" ? document.hasFocus() : true;
  };

  const isActuallyFullscreen = () => {
    // Fullscreen API check
    if (typeof document !== "undefined" && !!document.fullscreenElement)
      return true;

    // Fallback: compare viewport size to screen size (detect browser F11 fullscreen)
    if (typeof window !== "undefined" && typeof screen !== "undefined") {
      const heightDiff = Math.abs(window.innerHeight - screen.height);
      const widthDiff = Math.abs(window.innerWidth - screen.width);
      // allow small tolerance (4px) because some chrome UI / OS UI may reduce height slightly
      const tolerance = 4;
      return heightDiff <= tolerance && widthDiff <= tolerance;
    }

    return false;
  };

  const clearCountdown = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
  };

  // ---------- Countdown logic ----------
  const startCountdown = (seconds = 10) => {
    // reset
    clearCountdown();
    setCountdown(seconds);
    startTimeRef.current = Date.now();

    // update every 200ms for snappy recovery (we calculate remaining from elapsed)
    intervalRef.current = window.setInterval(() => {
      const start = startTimeRef.current ?? Date.now();
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, seconds - elapsed);
      setCountdown(remaining);

      // if time expired and we are still showing warning -> redirect
      if (remaining <= 0) {
        clearCountdown();
        // double-check final state: still violation?
        const recoveredNow = isActuallyFullscreen() && isActuallyFocused();
        if (!recoveredNow && showingRef.current) {
          // final redirect
          router.push("/cheating-detected");
        } else {
          // recovered exactly on expiry - treat as recovery
          setShowWarning(false);
          showingRef.current = false;
        }
      }
    }, 200);
  };

  const triggerViolation = () => {
    if (!showingRef.current) {
      showingRef.current = true;
      setShowWarning(true);
      // start a fresh 10s countdown
      startCountdown(10);
    }
  };

  const performRecovery = () => {
    // If already not showing -> nothing
    if (!showingRef.current) return;

    // Prevent re-entrant recovery
    if (recoveringRef.current) return;

    const nowFullscreen = isActuallyFullscreen();
    const nowFocused = isActuallyFocused();

    // require BOTH conditions for recovery (as requested)
    if (nowFullscreen && nowFocused) {
      recoveringRef.current = true;
      // clear timer and hide dialog
      clearCountdown();
      setShowWarning(false);
      showingRef.current = false;
      setCountdown(10);

      // small delay to unlock re-entrancy (so repeated violations later still work)
      window.setTimeout(() => {
        recoveringRef.current = false;
      }, 150);
    }
  };

  // ---------- Event handlers ----------
  useEffect(() => {
    // initialize visual states
    setHasFocus(isActuallyFocused());
    setIsInFullscreen(isActuallyFullscreen());

    const onVisibility = () => {
      const visState = document.visibilityState;
      // if page hidden -> violation
      if (visState === "hidden") {
        setHasFocus(false);
        triggerViolation();
      } else {
        // page visible again -> update focus and attempt recovery
        setHasFocus(isActuallyFocused());
        // run recovery slightly after visibility changes to allow browser to stabilize
        window.setTimeout(performRecovery, 80);
      }
    };

    const onFocus = () => {
      setHasFocus(true);
      // allow a short delay (some browsers need it) then attempt recovery
      window.setTimeout(performRecovery, 50);
    };

    const onBlur = () => {
      setHasFocus(false);
      triggerViolation();
    };

    const onFullscreenChange = () => {
      const nowFs = isActuallyFullscreen();
      setIsInFullscreen(nowFs);

      if (!nowFs) {
        // left fullscreen -> violation
        triggerViolation();
      } else {
        // returned to fullscreen -> try recovery
        window.setTimeout(performRecovery, 50);
      }
    };

    const onResize = () => {
      // using resize to detect F11 toggles
      const nowFs = isActuallyFullscreen();
      setIsInFullscreen(nowFs);
      if (!nowFs) {
        // if size no longer matches screen -> still a violation
        // don't spam trigger if already showing
        triggerViolation();
      } else {
        window.setTimeout(performRecovery, 50);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("resize", onResize);

    // optional: attempt entering fullscreen on mount (as original code did)
    (async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsInFullscreen(isActuallyFullscreen());
        }
      } catch {
        // ignore failures to request fullscreen
      }
    })();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("resize", onResize);
      clearCountdown();
      // attempt to exit fullscreen cleanly
      if (document.fullscreenElement) {
        // note: ignore errors
        document.exitFullscreen().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep derived UI states in sync if something mutated them
  useEffect(() => {
    // whenever we detect both conditions met, run recovery
    if (showingRef.current) {
      performRecovery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInFullscreen, hasFocus]);

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Online Exam</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isInFullscreen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isInFullscreen ? "Fullscreen Active" : "Not Fullscreen"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  hasFocus ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {hasFocus ? "Focused" : "Lost Focus"}
              </span>
            </div>
          </div>
        </div>

        {/* content (questions, etc.) */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Exam Instructions
            </h2>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>You must remain in fullscreen mode during the exam</li>
              <li>Do not switch tabs, minimize the window, or hide the page</li>
              <li>Violations will trigger a 10-second warning</li>
              <li>
                <strong>
                  If you return within 10s — everything is fine and
                  uninterrupted
                </strong>
              </li>
            </ul>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Question 1
            </h2>
            <p className="text-gray-700 mb-4">What is the capital of France?</p>
            <div className="space-y-2">
              {["London", "Berlin", "Paris", "Madrid"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input type="radio" name="q1" className="w-4 h-4" />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Question 2
            </h2>
            <p className="text-gray-700 mb-4">What is 2 + 2?</p>
            <div className="space-y-2">
              {["3", "4", "5", "6"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input type="radio" name="q2" className="w-4 h-4" />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>Test the proctoring:</strong> Try pressing Esc to exit
              fullscreen or switching to another tab. Return within 10 seconds
              to continue your exam seamlessly.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Current State (Debug Info):
            </h3>
            <div className="text-xs font-mono space-y-1 text-gray-700">
              <div>
                showWarning: <strong>{String(showWarning)}</strong>
              </div>
              <div>
                countdown: <strong>{countdown}</strong>
              </div>
              <div>
                isInFullscreen: <strong>{String(isInFullscreen)}</strong>
              </div>
              <div>
                hasFocus: <strong>{String(hasFocus)}</strong>
              </div>
              <div>
                timerActive:{" "}
                <strong>{String(intervalRef.current !== null)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <span className="text-3xl">⚠️</span>
              Violation Detected
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              You left fullscreen or the exam lost focus. Please return within{" "}
              <strong className="text-red-600 text-xl">{countdown}</strong>{" "}
              seconds or the exam will end.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-200 ease-linear"
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {isInFullscreen
                ? "✓ Fullscreen restored"
                : "✗ Please return to fullscreen"}
              {" • "}
              {hasFocus ? "✓ Focus restored" : "✗ Please click on the exam"}
            </p>
            {isInFullscreen && hasFocus && (
              <p className="text-sm text-green-600 text-center font-semibold">
                Conditions met! Dialog will close automatically and your exam
                continues.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
