import { useEffect, useRef, useState } from "react";

interface UseExamProctorOptions {
  onViolationTimeout?: () => void;
  isEnabled?: boolean;
}

interface UseExamProctorReturn {
  showWarning: boolean;
  countdown: number;
  isInFullscreen: boolean;
  hasFocus: boolean;
  isTimerActive: boolean;
}

/**
 * useExamProctor
 *
 * A React hook that monitors exam integrity by:
 * - Detecting when the page loses focus or exits fullscreen
 * - Showing a warning with a 10-second countdown
 * - Calling onViolationTimeout if the student doesn't return within 10 seconds
 * - Automatically recovering if conditions are restored
 *
 * @param options.onViolationTimeout - Callback function when 10 seconds expire
 * @param options.isEnabled - Whether proctoring is active (default: true)
 */
export function useExamProctor({
  onViolationTimeout,
  isEnabled = true,
}: UseExamProctorOptions = {}): UseExamProctorReturn {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isInFullscreen, setIsInFullscreen] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(true);

  // refs
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const showingRef = useRef<boolean>(false);
  const recoveringRef = useRef<boolean>(false);

  // ---------- Helpers ----------
  const isActuallyFocused = () => {
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
    clearCountdown();
    setCountdown(seconds);
    startTimeRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      const start = startTimeRef.current ?? Date.now();
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, seconds - elapsed);
      setCountdown(remaining);

      if (remaining <= 0) {
        clearCountdown();
        const recoveredNow = isActuallyFullscreen() && isActuallyFocused();
        if (!recoveredNow && showingRef.current) {
          // Call the timeout callback
          onViolationTimeout?.();
          // Hide warning after timeout
          setShowWarning(false);
          showingRef.current = false;
        } else {
          setShowWarning(false);
          showingRef.current = false;
        }
      }
    }, 200);
  };

  const triggerViolation = () => {
    if (!showingRef.current && isEnabled) {
      showingRef.current = true;
      setShowWarning(true);
      startCountdown(10);
    }
  };

  const performRecovery = () => {
    if (!showingRef.current) return;
    if (recoveringRef.current) return;

    const nowFullscreen = isActuallyFullscreen();
    const nowFocused = isActuallyFocused();

    if (nowFullscreen && nowFocused) {
      recoveringRef.current = true;
      clearCountdown();
      setShowWarning(false);
      showingRef.current = false;
      setCountdown(10);

      window.setTimeout(() => {
        recoveringRef.current = false;
      }, 150);
    }
  };

  // ---------- Event handlers ----------
  useEffect(() => {
    if (!isEnabled) return;

    setHasFocus(isActuallyFocused());
    setIsInFullscreen(isActuallyFullscreen());

    const onVisibility = () => {
      const visState = document.visibilityState;
      if (visState === "hidden") {
        setHasFocus(false);
        triggerViolation();
      } else {
        setHasFocus(isActuallyFocused());
        window.setTimeout(performRecovery, 80);
      }
    };

    const onFocus = () => {
      setHasFocus(true);
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
        triggerViolation();
      } else {
        window.setTimeout(performRecovery, 50);
      }
    };

    const onResize = () => {
      const nowFs = isActuallyFullscreen();
      setIsInFullscreen(nowFs);
      if (!nowFs) {
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

    // Attempt entering fullscreen on mount
    (async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsInFullscreen(isActuallyFullscreen());
        }
      } catch {
        // ignore failures
      }
    })();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("resize", onResize);
      clearCountdown();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  useEffect(() => {
    if (showingRef.current && isEnabled) {
      performRecovery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInFullscreen, hasFocus, isEnabled]);

  return {
    showWarning,
    countdown,
    isInFullscreen,
    hasFocus,
    isTimerActive: intervalRef.current !== null,
  };
}
