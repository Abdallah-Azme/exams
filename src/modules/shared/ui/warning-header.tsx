import { AlertCircle } from "lucide-react";
import React from "react";

export default function WarningHeader() {
  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-800 px-4 py-2 text-center flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
      <AlertCircle className="w-5 h-5 text-yellow-600" />
      <p>
        <strong>Notice:</strong> This is a{" "}
        <span className="underline">demo platform</span> for testing purposes
        only — used to evaluate students on the exam flow.
      </p>
    </div>
  );
}
