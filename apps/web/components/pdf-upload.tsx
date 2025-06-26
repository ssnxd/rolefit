"use client";

import type { AnalysisResponse, EvaluatorResult } from "@repo/api";
import { useRef, useState } from "react";
import trpc from "../lib/trpc";
import FileUploadBox, { type UploadedFile } from "./file-upload-box";
import AnalysisResults from "./analysis-results";
import { useFileUpload } from "../lib/file-utils";

/**
 * PDFUpload Component
 *
 * A comprehensive file upload component for analyzing CV-Job compatibility.
 * Features:
 * - Drag & drop PDF upload
 * - File validation (PDF only, size limits)
 * - AI-powered analysis via tRPC
 * - Beautiful results display with scores and recommendations
 */
export default function PDFUpload() {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  /** CV file state - stores uploaded CV file with metadata */
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);

  /** Job description file state - stores uploaded job description file */
  const [jobFile, setJobFile] = useState<UploadedFile | null>(null);

  /** Loading state for analysis process */
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /** Error state for displaying validation and API errors */
  const [error, setError] = useState<string | null>(null);

  /** Analysis results from the AI evaluator */
  const [result, setResult] = useState<EvaluatorResult | null>(null);

  /** Drag over state to highlight drop zones during drag operations */
  const [dragOver, setDragOver] = useState<"cv" | "job" | null>(null);

  // =============================================================================
  // REFS FOR FILE INPUTS
  // =============================================================================

  /** Reference to CV file input element */
  const cvInputRef = useRef<HTMLInputElement>(null);

  /** Reference to job description file input element */
  const jobInputRef = useRef<HTMLInputElement>(null);

  // =============================================================================
  // FILE HANDLING HOOKS
  // =============================================================================

  /** File upload utilities */
  const fileUploadUtils = useFileUpload();

  // =============================================================================
  // FILE HANDLING FUNCTIONS
  // =============================================================================

  /**
   * Handles file selection from input or drag & drop
   * @param file - Selected file object
   * @param type - Type of file being uploaded ("cv" or "job")
   */
  const handleFileSelect = (file: File, type: "cv" | "job") => {
    const uploadedFile = fileUploadUtils.handleFileSelect(file, setError);

    if (uploadedFile) {
      // Update appropriate state based on file type
      if (type === "cv") {
        setCvFile(uploadedFile);
      } else {
        setJobFile(uploadedFile);
      }
    }
  };

  /**
   * Handles drag and drop file events
   * @param e - Drag event
   * @param type - Drop zone type ("cv" or "job")
   */
  const handleDrop = (e: React.DragEvent, type: "cv" | "job") => {
    setDragOver(null);
    const uploadedFile = fileUploadUtils.handleDrop(e, setError);

    if (uploadedFile) {
      // Update appropriate state based on file type
      if (type === "cv") {
        setCvFile(uploadedFile);
      } else {
        setJobFile(uploadedFile);
      }
    }
  };

  /**
   * Handles drag over events to highlight drop zones
   * @param e - Drag event
   * @param type - Drop zone type ("cv" or "job")
   */
  const handleDragOver = (e: React.DragEvent, type: "cv" | "job") => {
    fileUploadUtils.handleDragOver(e);
    setDragOver(type);
  };

  /**
   * Handles drag leave events to remove drop zone highlighting
   * @param e - Drag event
   */
  const handleDragLeave = (e: React.DragEvent) => {
    fileUploadUtils.handleDragLeave(e);
    setDragOver(null);
  };

  /**
   * Removes uploaded file and resets input
   * @param type - Type of file to remove ("cv" or "job")
   */
  const removeFile = (type: "cv" | "job") => {
    if (type === "cv") {
      setCvFile(null);
      // Reset file input value
      if (cvInputRef.current) cvInputRef.current.value = "";
    } else {
      setJobFile(null);
      // Reset file input value
      if (jobInputRef.current) jobInputRef.current.value = "";
    }
    setError(null);
  };

  // =============================================================================
  // ANALYSIS FUNCTION
  // =============================================================================

  /**
   * Handles the analysis process by sending files to AI service
   * Manages loading states and error handling
   */
  const handleAnalyze = async () => {
    // Validate that both files are uploaded
    if (!cvFile || !jobFile) {
      setError("Please upload both CV and Job Description files");
      return;
    }

    // Set loading state and clear previous results/errors
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Prepare form data with the actual File objects
      const formData = new FormData();
      formData.append("cv", cvFile.file);
      formData.append("jd", jobFile.file);

      // Call tRPC endpoint for analysis
      const response = (await trpc.analyze.mutate(
        formData,
      )) as AnalysisResponse;

      // Handle successful response
      if (response.ok && response.result) {
        setResult(response.result);
        console.log("Analysis result:", response.result);
      } else {
        // Handle API errors
        setError(response.message || "Analysis failed. Please try again.");
      }
    } catch (err) {
      // Handle network or unexpected errors
      console.error("Analysis failed:", err);
      setError("Analysis failed. Please try again.");
    } finally {
      // Always reset loading state
      setIsAnalyzing(false);
    }
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* =================================================================== */}
        {/* HEADER SECTION */}
        {/* =================================================================== */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            RoleFit Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your CV and job description to get an AI-powered
            compatibility analysis
          </p>
        </div>

        {/* =================================================================== */}
        {/* UPLOAD SECTION */}
        {/* =================================================================== */}
        <div className="space-y-8">
          {/* File upload grid - responsive layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* CV Upload */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Upload Your CV
              </h2>
              <FileUploadBox
                type="cv"
                file={cvFile}
                onFileSelect={(file) => handleFileSelect(file, "cv")}
                inputRef={cvInputRef}
                dragOver={dragOver}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onRemoveFile={removeFile}
              />
            </div>

            {/* Job Description Upload */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. Upload Job Description
              </h2>
              <FileUploadBox
                type="job"
                file={jobFile}
                onFileSelect={(file) => handleFileSelect(file, "job")}
                inputRef={jobInputRef}
                dragOver={dragOver}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onRemoveFile={removeFile}
              />
            </div>
          </div>
          {/* =================================================================== */}
          {/* ERROR DISPLAY */}
          {/* =================================================================== */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                {/* Error icon */}
                <svg
                  className="w-5 h-5 text-red-400 mr-2 mt-0.5"
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
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
          {/* =================================================================== */}
          {/* ANALYZE BUTTON */}
          {/* =================================================================== */}
          <div className="text-center pt-8">
            <button
              onClick={handleAnalyze}
              disabled={!cvFile || !jobFile || isAnalyzing}
              className={`px-12 py-4 text-lg font-semibold rounded-lg transition-all duration-200 ${
                !cvFile || !jobFile || isAnalyzing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isAnalyzing ? (
                // Loading state with spinner
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                "Analyze"
              )}
            </button>
          </div>{" "}
          {/* =================================================================== */}
          {/* RESULTS SECTION */}
          {/* =================================================================== */}
          {result && (
            <AnalysisResults
              result={result}
              onReset={() => {
                // Reset all state for new analysis
                setResult(null);
                setCvFile(null);
                setJobFile(null);
                // Clear file inputs
                if (cvInputRef.current) cvInputRef.current.value = "";
                if (jobInputRef.current) jobInputRef.current.value = "";
                setError(null);
              }}
            />
          )}
          {/* =================================================================== */}
          {/* INSTRUCTIONS SECTION */}
          {/* =================================================================== */}
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
            <ol className="space-y-2 text-gray-600">
              <li className="flex">
                <span className="font-medium mr-2">1.</span>
                Upload your CV in PDF format
              </li>
              <li className="flex">
                <span className="font-medium mr-2">2.</span>
                Upload the job description in PDF format
              </li>
              <li className="flex">
                <span className="font-medium mr-2">3.</span>
                Click &quot;Analyze&quot; to get AI-powered compatibility
                insights
              </li>
              <li className="flex">
                <span className="font-medium mr-2">4.</span>
                Review detailed analysis and recommendations
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
