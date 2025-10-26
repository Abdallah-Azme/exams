import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface DesmosCalculatorProps {
  setShowCalculator: Dispatch<SetStateAction<boolean>>;
}

export default function DesmosCalculator({
  setShowCalculator,
}: DesmosCalculatorProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setShowCalculator(false)}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Graphing Calculator</h3>
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

        <div className="flex-1 relative">
          <iframe
            src="https://www.desmos.com/calculator"
            className="w-full h-full border-0"
            title="Desmos Graphing Calculator"
          />
        </div>
      </div>
    </div>
  );
}
