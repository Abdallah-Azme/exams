import React from "react";

export default function CheatingAlerts() {
  const rules = [
    {
      type: "Tab Switching",
      description:
        "Switching to another tab or window during the exam is considered a violation.",
      recovery: "Return to the exam tab within 10 seconds to continue safely.",
    },
    {
      type: "Resize",
      description:
        "Changing or resizing the exam window can trigger a warning.",
      recovery: "Restore the correct zoom/size within 10 seconds to recover.",
    },
    {
      type: "Using AI Assistance",
      description:
        "Using any AI tools or external assistance to answer exam questions is strictly prohibited.",
      recovery:
        "Stop using the AI assistance immediately. You have 10 seconds to continue normally, else the exam will end and be logged as a cheating case.",
    },
  ];

  return (
    <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-md space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        ℹ️ Cheating Rules
      </h2>
      <p>
        During the exam, violations are monitored. You have{" "}
        <strong>10 seconds</strong> to recover after a warning. If you fail to
        recover in time, the exam will end immediately and be recorded as a
        cheating case.
      </p>

      <ul className="space-y-3">
        {rules.map((rule, idx) => (
          <li key={idx} className="p-4 bg-white rounded-md shadow-sm border">
            <h3 className="font-semibold">{rule.type}</h3>
            <p className="text-gray-700">{rule.description}</p>
            <p className="text-green-700 mt-1 font-medium">
              Recovery: {rule.recovery}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
