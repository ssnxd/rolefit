import type { appRouter } from ".";

/**
 * Result object returned by the resume-to-job evaluator
 * Contains comprehensive analysis of how well a resume matches a job posting
 */
export interface EvaluatorResult {
  /** Overall match score from 0 to 100, where 100 is a perfect fit */
  score: number;
  /** One-paragraph overview of how well the resume aligns with the job requirements */
  summary: string;
  /** Bullet list of well-aligned skills, experience, or qualifications from the resume */
  strengths: string;
  /** Bullet list of missing or weak areas where the resume doesn't match job requirements */
  gaps: string;
  /** Bullet list of actionable recommendations to improve the resume for this specific job */
  suggestions: string;
}

/**
 * Standard API response wrapper for analysis operations
 * Provides consistent error handling and result structure
 */
export interface AnalysisResponse {
  /** Whether the analysis operation completed successfully */
  ok: boolean;
  /** Human-readable message describing the result or any errors */
  message: string;
  /** The actual evaluation result, null if operation failed */
  result: EvaluatorResult | null;
}

/**
 * Type-safe reference to the tRPC router for client-side usage
 * Enables full TypeScript intellisense and type checking for API calls
 */
export type AppRouter = typeof appRouter;
