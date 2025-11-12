import { Calculator } from "lucide-react";
import { AssistanceSheet } from "../../shared/ui/assistance-sheet";
export default function ActiveExamHeader({
  currentModule,
  examData,
  isInFullscreen,
  hasFocus,
  setShowCalculator,
  timeLeft,
  formatTime,
  showCalculator,
  showHelpSheet,
  setHelpSheet,
}: any) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-2 bg-gray-100 text-sm font-medium">
      <div className="text-gray-600">
        Mathematics Exam -
        {currentModule === "model_a" || currentModule === "review_a"
          ? examData?.data?.user_exam?.models?.model_a?.name
          : examData?.data?.user_exam?.models?.model_b?.name}
      </div>

      <div className="text-gray-600 text-2xl font-bold">
        Time Remaining: {formatTime(timeLeft || 0)}
      </div>

      <div className="flex items-center gap-4">
        {/* Proctoring Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                isInFullscreen ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-600">
              {isInFullscreen ? "Fullscreen" : "Exit FS"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                hasFocus ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-600">
              {hasFocus ? "Focused" : "Lost Focus"}
            </span>
          </div>
        </div>
        {/* asset */}
        <AssistanceSheet />
        {/* calculator */}
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title="Open Calculator"
        >
          <Calculator size={20} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
}
