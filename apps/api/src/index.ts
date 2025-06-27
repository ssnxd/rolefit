/**
 * RoleFit API Server
 * 
 * This is the main entry point for the RoleFit API server that analyzes
 * CVs/resumes against job descriptions using AI evaluation.
 */

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { zfd } from "zod-form-data";
import { appConfig } from "./config";
import { Evaluator } from "./evaluator";
import { publicProcedure, router } from "./trpc";

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ["application/pdf"]; // Only PDF files are supported

/**
 * Custom file validation schema for PDF uploads
 * Validates that uploaded files are:
 * - PDF format only
 * - Under the maximum file size limit
 */
const pdfFileSchema = zfd
  .file()
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  })
  .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
    message: "Only PDF files are allowed",
  });

/**
 * Main tRPC router configuration
 * Defines all available API endpoints and their handlers
 */
export const appRouter = router({
  /**
   * Analyze endpoint - Main functionality for CV/Resume analysis
   * 
   * Accepts two PDF files:
   * - cv: The candidate's CV/resume file
   * - jd: The job description file
   * 
   * Returns an evaluation result comparing the CV against the job requirements
   */
  analyze: publicProcedure
    .input(
      zfd.formData({
        cv: pdfFileSchema,  // CV/Resume PDF file
        jd: pdfFileSchema,  // Job Description PDF file
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { cv, jd } = input;

      try {
        // Create a new evaluator instance and process the files
        const evaluator = new Evaluator();
        const result = await evaluator.evaluate(cv, jd);

        return result;
      } catch (error) {
        // Log the error for debugging and return a user-friendly error response
        console.error("Error processing PDF files or evaluation:", error);
        return {
          ok: false,
          message: "Failed to process PDF files or evaluate resume",
          result: null,
        };
      }
    }),
});

/**
 * HTTP Server Setup
 * Creates a standalone HTTP server with CORS middleware and tRPC router
 */
const server = createHTTPServer({
  middleware: cors(), // Enable CORS for cross-origin requests
  router: appRouter,  // Attach our tRPC router
});

/**
 * Start the server
 * Listens on the configured port and displays startup information
 */
server.listen(appConfig.port, () => {
  console.log(`🚀 RoleFit API server started successfully!`);
  console.log(`📍 Server running on http://localhost:${appConfig.port}`);
  console.log(`🕒 Started at ${new Date().toISOString()}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /analyze - Analyze CV against job description`);
});
