"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Minimize2, Maximize2 } from "lucide-react";

interface DesmosCalculatorProps {
  setShowCalculator: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DesmosCalculator({
  setShowCalculator,
}: DesmosCalculatorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Responsive initial values
  const getInitialSize = () => {
    if (typeof window === "undefined") return { width: 700, height: 500 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw < 640) {
      // Mobile: 60% of screen height to leave room for question
      return { width: vw - 20, height: vh * 0.6 };
    }
    return { width: Math.min(700, vw - 100), height: Math.min(500, vh - 100) };
  };

  const getInitialPosition = () => {
    if (typeof window === "undefined") return { x: 100, y: 100 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw < 640) {
      // Mobile: bottom of screen
      return { x: 10, y: vh * 0.35 };
    }
    return { x: (vw - 700) / 2, y: (vh - 500) / 2 };
  };

  const [position, setPosition] = useState(getInitialPosition());
  const [size, setSize] = useState(getInitialSize());

  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      setSize(getInitialSize());
      setPosition(getInitialPosition());
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getMinSize = () => {
    return isMobile ? { width: 280, height: 150 } : { width: 400, height: 300 };
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (isResizing.current) return;
    isDragging.current = true;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragOffset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
    e.preventDefault();
  };

  const startResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    resizeStart.current = {
      x: clientX,
      y: clientY,
      width: size.width,
      height: size.height,
    };
  };

  const toggleMinimize = () => {
    if (!isMobile) return;

    if (isMinimized) {
      // Restore
      setSize({
        width: window.innerWidth - 20,
        height: window.innerHeight * 0.6,
      });
      setIsMinimized(false);
    } else {
      // Minimize to small size at bottom
      setSize({ width: window.innerWidth - 20, height: 60 });
      setPosition({ x: 10, y: window.innerHeight - 80 });
      setIsMinimized(true);
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging.current) {
        setPosition({
          x: clientX - dragOffset.current.x,
          y: clientY - dragOffset.current.y,
        });
      }

      if (isResizing.current) {
        const minSize = getMinSize();
        const maxWidth = window.innerWidth - position.x - 10;
        const maxHeight = window.innerHeight - position.y - 10;

        const newWidth = Math.max(
          minSize.width,
          Math.min(
            maxWidth,
            resizeStart.current.width + (clientX - resizeStart.current.x)
          )
        );
        const newHeight = Math.max(
          minSize.height,
          Math.min(
            maxHeight,
            resizeStart.current.height + (clientY - resizeStart.current.y)
          )
        );

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const stopActions = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", stopActions);
    window.addEventListener("touchend", stopActions);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", stopActions);
      window.removeEventListener("touchend", stopActions);
    };
  }, [isMobile, position]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Draggable + Resizable container */}
      <div
        className="absolute z-10 pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden w-full h-full">
          {/* Header (drag handle) */}
          <div
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="flex items-center justify-between px-3 sm:px-4 py-2 border-b bg-gray-50 select-none cursor-move"
          >
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">
                {isMinimized
                  ? "Calculator (tap to expand)"
                  : "Graphing Calculator"}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {isMobile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMinimize}
                  className="text-gray-500 hover:text-gray-700 h-7 w-7 p-0"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 size={14} />
                  ) : (
                    <Minimize2 size={14} />
                  )}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCalculator(false)}
                className="text-gray-500 hover:text-gray-700 h-7 w-7 p-0"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="relative flex-1">
              <iframe
                src="https://www.desmos.com/calculator"
                className="w-full h-full border-0"
                title="Desmos Graphing Calculator"
              />

              {/* Resize Handle */}
              <div
                onMouseDown={startResize}
                onTouchStart={startResize}
                className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-10 touch-none"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 50%, rgba(59, 130, 246, 0.6) 50%)",
                }}
                title="Drag to resize"
              >
                <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <div className="absolute bottom-1.5 right-3.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <div className="absolute bottom-3.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
