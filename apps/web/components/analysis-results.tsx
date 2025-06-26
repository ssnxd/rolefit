import type { EvaluatorResult } from "@repo/api";

/**
 * Props for the AnalysisResults component
 */
interface AnalysisResultsProps {
  /** The analysis result from the AI evaluator */
  result: EvaluatorResult;
  /** Callback to reset the analysis and start over */
  onReset: () => void;
}

/**
 * AnalysisResults Component
 *
 * Displays the comprehensive analysis results from the AI evaluator
 * Shows compatibility score, summary, strengths, gaps, and suggestions
 */
export default function AnalysisResults({
  result,
  onReset,
}: AnalysisResultsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Analysis Results
      </h3>

      {/* Compatibility Score Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">
            Compatibility Score
          </span>
          <span className="text-3xl font-bold text-blue-600">
            {result.score}/100
          </span>
        </div>
        {/* Animated progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${result.score}%` }}
          ></div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Summary</h4>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* Three-column analysis grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Strengths Column */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            {/* Checkmark icon */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Strengths
          </h4>
          <div className="text-green-700 whitespace-pre-line">
            {result.strengths}
          </div>
        </div>

        {/* Gaps Column */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
            {/* Warning icon */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Gaps
          </h4>
          <div className="text-red-700 whitespace-pre-line">{result.gaps}</div>
        </div>

        {/* Suggestions Column */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            {/* Lightbulb icon */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Suggestions
          </h4>
          <div className="text-blue-700 whitespace-pre-line">
            {result.suggestions}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Analyze Another Pair
        </button>
      </div>
    </div>
  );
}
