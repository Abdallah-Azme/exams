"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface DesmosCalculatorProps {
  setShowCalculator: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DesmosCalculator({
  setShowCalculator,
}: DesmosCalculatorProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 700, height: 500 });

  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const startDrag = (e: React.MouseEvent) => {
    if (isResizing.current) return;
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }

      if (isResizing.current) {
        const newWidth = Math.max(
          400,
          resizeStart.current.width + (e.clientX - resizeStart.current.x)
        );
        const newHeight = Math.max(
          300,
          resizeStart.current.height + (e.clientY - resizeStart.current.y)
        );

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const stopActions = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    if (isDragging.current || isResizing.current) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", stopActions);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", stopActions);
      };
    }
  }, []);

  // Add global listeners when component mounts
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }

      if (isResizing.current) {
        const newWidth = Math.max(
          400,
          resizeStart.current.width + (e.clientX - resizeStart.current.x)
        );
        const newHeight = Math.max(
          300,
          resizeStart.current.height + (e.clientY - resizeStart.current.y)
        );

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const stopActions = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopActions);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopActions);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={() => setShowCalculator(false)}
      />

      {/* Draggable + Resizable container */}
      <div
        className="absolute z-10"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden w-full h-full">
          {/* Header (drag handle) */}
          <div
            onMouseDown={startDrag}
            className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 cursor-move select-none"
          >
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Graphing Calculator
              </h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowCalculator(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className="relative flex-1">
            <iframe
              src="https://www.desmos.com/calculator"
              className="w-full h-full border-0"
              title="Desmos Graphing Calculator"
            />

            {/* Resize Handle - More visible */}
            <div
              onMouseDown={startResize}
              className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-10"
              style={{
                background:
                  "linear-gradient(135deg, transparent 50%, rgba(59, 130, 246, 0.5) 50%)",
              }}
              title="Drag to resize"
            >
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-600 rounded-full"></div>
              <div className="absolute bottom-1 right-2.5 w-1 h-1 bg-blue-600 rounded-full"></div>
              <div className="absolute bottom-2.5 right-1 w-1 h-1 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
