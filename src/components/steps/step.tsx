import React from "react";

interface StepItem {
  label: string;
  description?: string;
  error?: boolean;
  isNavegable?: boolean;
  onClick?: (step: number) => void;
}

interface StepProps {
  steps: StepItem[];
  curretStep: number;
}

export default function Step({ steps, curretStep }: StepProps) {
  return (
    <div className="flex items-start justify-between my-2 w-full select-none">
      {steps.map((step, index) => {
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center justify-center shrink-0">
              <div
                onClick={
                  step.isNavegable ? () => step.onClick?.(index) : undefined
                }
                className={`w-8 h-8 ${
                  step.isNavegable ? "cursor-pointer" : ""
                } rounded-full flex items-center justify-center ${
                  step.error
                    ? "bg-red-500"
                    : curretStep >= index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {index + 1}
              </div>
              {step.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center max-w-20 whitespace-normal">
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mt-4 ${
                  step.error && curretStep >= index + 1
                    ? "bg-red-500"
                    : curretStep >= index + 1
                      ? "bg-blue-500"
                      : "bg-gray-200 dark:bg-gray-700"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
