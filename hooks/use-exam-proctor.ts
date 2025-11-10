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
 * - Blocking right-click context menu
 * - Detecting and warning about DevTools being opened
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
  const devToolsCheckIntervalRef = useRef<number | null>(null);
  const isMobileRef = useRef<boolean>(false);
  const lastResizeTimeRef = useRef<number>(0);
  const inputFocusedRef = useRef<boolean>(false);

  // ---------- Helpers ----------
  const isMobileDevice = () => {
    if (typeof navigator === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const isActuallyFocused = () => {
    return typeof document !== "undefined" ? document.hasFocus() : true;
  };

  const isActuallyFullscreen = () => {
    // On mobile, fullscreen API may not work reliably, so we're more lenient
    if (isMobileRef.current) {
      // For mobile, just check if the page has focus
      return isActuallyFocused();
    }

    // Fullscreen API check (desktop)
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
    // Don't trigger if an input is focused (keyboard is likely open)
    if (inputFocusedRef.current && isMobileRef.current) {
      return;
    }

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

  // ---------- DevTools Detection (Desktop only) ----------
  const detectDevTools = () => {
    // Skip DevTools detection on mobile devices
    if (isMobileRef.current) return;

    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    // Check if devtools is likely open (docked)
    if (widthThreshold || heightThreshold) {
      triggerViolation();
    }
  };

  // ---------- Event handlers ----------
  useEffect(() => {
    if (!isEnabled) return;

    // Detect if mobile device
    isMobileRef.current = isMobileDevice();

    setHasFocus(isActuallyFocused());
    setIsInFullscreen(isActuallyFullscreen());

    // Track input focus to prevent false violations on mobile
    const onInputFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        inputFocusedRef.current = true;
      }
    };

    const onInputBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        inputFocusedRef.current = false;
      }
    };

    // Prevent right-click (desktop only)
    const onContextMenu = (e: MouseEvent) => {
      if (!isMobileRef.current) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent common DevTools shortcuts (desktop only)
    const onKeyDown = (e: KeyboardEvent) => {
      if (isMobileRef.current) return;

      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C / Cmd+Option+C (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }

      // Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        return false;
      }
    };

    const onVisibility = () => {
      const visState = document.visibilityState;
      if (visState === "hidden") {
        setHasFocus(false);
        // On mobile, don't trigger violation if input is focused (keyboard might be causing this)
        if (!inputFocusedRef.current || !isMobileRef.current) {
          triggerViolation();
        }
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
      // Don't trigger violation immediately on mobile if input is focused
      if (!inputFocusedRef.current || !isMobileRef.current) {
        triggerViolation();
      }
    };

    const onFullscreenChange = () => {
      const nowFs = isActuallyFullscreen();
      setIsInFullscreen(nowFs);

      if (!nowFs && !isMobileRef.current) {
        triggerViolation();
      } else {
        window.setTimeout(performRecovery, 50);
      }
    };

    const onResize = () => {
      const now = Date.now();
      const timeSinceLastResize = now - lastResizeTimeRef.current;
      lastResizeTimeRef.current = now;

      // On mobile, ignore rapid resize events (likely keyboard opening/closing)
      if (isMobileRef.current && timeSinceLastResize < 300) {
        return;
      }

      const nowFs = isActuallyFullscreen();
      setIsInFullscreen(nowFs);

      // Only trigger violation on desktop or if no input is focused on mobile
      if (!nowFs && (!isMobileRef.current || !inputFocusedRef.current)) {
        triggerViolation();
      } else {
        window.setTimeout(performRecovery, 50);
      }

      // Check for DevTools on resize (desktop only)
      if (!isMobileRef.current) {
        detectDevTools();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("focusin", onInputFocus, true);
    document.addEventListener("focusout", onInputBlur, true);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("resize", onResize);

    // Start DevTools detection interval (desktop only)
    if (!isMobileRef.current) {
      devToolsCheckIntervalRef.current = window.setInterval(
        detectDevTools,
        1000
      );
    }

    // Attempt entering fullscreen on mount (desktop only)
    if (!isMobileRef.current) {
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
    }

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("focusin", onInputFocus, true);
      document.removeEventListener("focusout", onInputBlur, true);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("resize", onResize);

      if (devToolsCheckIntervalRef.current !== null) {
        window.clearInterval(devToolsCheckIntervalRef.current);
        devToolsCheckIntervalRef.current = null;
      }

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
