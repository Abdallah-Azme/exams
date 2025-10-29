"use client";

import { Loader2 } from "lucide-react";

export default function ExamSubmissionLoading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-[9999]">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Digital Practice Is Over: Stand By!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          All your work has been saved, and we're uploading it now. Do not
          refresh this page or quit the app.
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>

        {/* Laptop Illustration */}
        <div className="mb-8">
          <svg
            className="w-48 h-48 mx-auto"
            viewBox="0 0 200 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Laptop Base */}
            <rect
              x="30"
              y="90"
              width="140"
              height="8"
              rx="2"
              fill="#374151"
              stroke="#1F2937"
              strokeWidth="2"
            />

            {/* Laptop Screen */}
            <rect
              x="50"
              y="30"
              width="100"
              height="65"
              rx="2"
              fill="#E5E7EB"
              stroke="#1F2937"
              strokeWidth="2"
            />

            {/* Screen Inner */}
            <rect x="55" y="35" width="90" height="55" fill="#F9FAFB" />

            {/* Hourglass Icon on Screen */}
            <g transform="translate(85, 50)">
              {/* Top bulb */}
              <ellipse
                cx="15"
                cy="8"
                rx="10"
                ry="6"
                fill="#3B82F6"
                opacity="0.3"
              />

              {/* Middle neck */}
              <path d="M 10 8 L 15 15 L 20 8" fill="#3B82F6" opacity="0.5" />

              {/* Bottom bulb */}
              <ellipse
                cx="15"
                cy="22"
                rx="10"
                ry="6"
                fill="#3B82F6"
                opacity="0.7"
              />

              {/* Sand particles */}
              <circle cx="15" cy="20" r="1.5" fill="#1E40AF" />
              <circle cx="13" cy="21" r="1" fill="#1E40AF" />
              <circle cx="17" cy="21" r="1" fill="#1E40AF" />

              {/* Hourglass frame */}
              <path
                d="M 5 5 L 5 8 Q 5 10 7 12 L 15 15 L 23 12 Q 25 10 25 8 L 25 5 M 5 25 L 5 22 Q 5 20 7 18 L 15 15 L 23 18 Q 25 20 25 22 L 25 25"
                stroke="#1F2937"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="5"
                y1="5"
                x2="25"
                y2="5"
                stroke="#1F2937"
                strokeWidth="1.5"
              />
              <line
                x1="5"
                y1="25"
                x2="25"
                y2="25"
                stroke="#1F2937"
                strokeWidth="1.5"
              />
            </g>

            {/* Laptop keyboard area */}
            <rect x="60" y="95" width="80" height="2" fill="#9CA3AF" />
          </svg>
        </div>

        {/* Bottom message */}
        <p className="text-sm text-gray-500">
          If this screen doesn't update in a few minutes, hit{" "}
          <span className="font-semibold">Return to Home</span>
        </p>
      </div>
    </div>
  );
}
