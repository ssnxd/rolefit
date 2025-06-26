/**
 * Resume Evaluation Service
 *
 * This service analyzes how well a candidate's resume matches a job description
 * using Google's Gemini AI. It takes two files (job description and resume)
 * and returns a detailed analysis including:
 * - Match score (0-100)
 * - Summary of alignment
 * - Candidate's strengths
 * - Skills/experience gaps
 * - Improvement suggestions
 */

import type {
  GenerateContentRequest,
  GenerateContentResponse,
} from "@google-cloud/vertexai";
import { appConfig } from "./config";
import type { EvaluatorResult } from "./types";
import { pdfToText } from "./utils/pdf";

/**
 * AI-powered Resume Evaluator
 *
 * This class handles the entire resume evaluation process:
 * 1. Sends job description and resume files to Gemini AI
 * 2. Gets structured analysis back
 * 3. Returns actionable insights for hiring decisions
 */
export class Evaluator {
  /**
   * System instructions for the AI
   * This tells Gemini exactly how to analyze resumes and what format to return
   */
  private systemInstruction = `You are an expert AI assistant that evaluates how well a candidate's resume aligns with a given job description.

Your task is to:
1. Analyze the **job description** and extract its key requirements, including skills, responsibilities, tools, and desired experience.
2. Analyze the **resume** to extract the candidate’s skills, experience, tools, achievements, and education.
3. Compare the two and provide an objective analysis in the following structured JSON format:

Return your answer strictly in this JSON format:

{
  "score": <number>,                // Overall match score from 0 to 100
  "summary": "<short paragraph>",   // One-paragraph overview of alignment
  "strengths": "<bullet points>",   // Bullet list of well-aligned skills or experience
  "gaps": "<bullet points>",        // Bullet list of missing or weak areas
  "suggestions": "<bullet points>"  // Bullet list of what can be improved in the resume to better fit the job
}

Guidelines:
- Be objective and only use information from the provided job description and resume.
- Do not fabricate information.
- Keep the tone professional and constructive.
- Use bullet points inside the JSON strings for strengths, gaps, and suggestions where applicable.

Inputs will be provided as:
- Job Description (text extracted from PDF)
- Resume (text extracted from PDF)

Example Output: 

{
  "score": 85,
  "summary": "The candidate demonstrates strong alignment with the core frontend requirements, including React, TypeScript, and team leadership. However, there are some gaps in backend technologies and cloud infrastructure experience.",
  "strengths": "- 5+ years with React and TypeScript\n- Led frontend team at a fast-paced startup\n- Experience with automated testing and CI/CD",
  "gaps": "- No mention of Node.js backend development\n- Lacks experience with AWS or cloud platforms\n- Missing explicit examples of cross-functional collaboration",
  "suggestions": "- Emphasize any backend projects using Node.js\n- Highlight experience with cloud platforms, if applicable\n- Add specific examples of collaboration with design or product teams"
}
    `;

  /**
   * User prompt that gets sent to Gemini along with the files
   * This gives context about what the attached files contain
   */
  private prompt = `
Return your answer strictly in this JSON format:

{
  "score": <number>,                // Overall match score from 0 to 100
  "summary": "<short paragraph>",   // One-paragraph overview of alignment
  "strengths": "<bullet points>",   // Bullet list of well-aligned skills or experience
  "gaps": "<bullet points>",        // Bullet list of missing or weak areas
  "suggestions": "<bullet points>"  // Bullet list of what can be improved in the resume to better fit the job
}

...

Return the result as raw JSON without any Markdown formatting or code fences.
`;

  /**
   * Sends files to Gemini AI for analysis
   * @param job - Job description file (PDF)
   * @param resume - Candidate's resume file (PDF)
   * @returns Promise with AI analysis response or null if failed
   */

  async queryGemini(
    jobText: string,
    resumeText: string,
  ): Promise<GenerateContentResponse | null> {
    try {
      // Create the proper payload structure for Gemini API
      // Following the GenerateContentRequest interface from VertexAI
      const payload: GenerateContentRequest = {
        contents: [
          {
            role: "user",
            parts: [
              // Text prompt explaining what to analyze
              { text: this.prompt },
              // Job description text
              { text: `\n\n**JOB DESCRIPTION:**\n${jobText}` },
              // Resume text
              { text: `\n\n**RESUME/CV:**\n${resumeText}` },
            ],
          },
        ],
        // System instructions tell the AI how to behave consistently
        systemInstruction: this.systemInstruction,
      };

      // Send the request to Gemini API with proper JSON payload
      const res = await fetch(appConfig.gemini.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${appConfig.gemini.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      // Check if the request was successful
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Gemini API request failed: ${res.status} ${res.statusText}\n${errorText}`,
        );
      }

      // Parse and return the AI response
      const data = (await res.json()) as GenerateContentResponse;
      return data;
    } catch (error: unknown) {
      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.error(
          "Error communicating with Gemini AI:",
          error.message || error,
        );
      } else {
        console.error("Unknown error occurred while calling Gemini:", error);
      }
      return null;
    }
  }

  /**
   * Main evaluation function - this is what you call to analyze a resume
   * @param jd - Job description file (PDF)
   * @param cv - Candidate's resume/CV file (PDF)
   * @returns Promise with evaluation results including score, strengths, gaps, etc.
   */
  async evaluate(
    jd: File,
    cv: File,
  ): Promise<{
    ok: boolean;
    message: string;
    result: EvaluatorResult | null;
  }> {
    try {
      const jobText = await pdfToText(jd);
      const resumeText = await pdfToText(cv);

      // Send files to AI for analysis
      const response = await this.queryGemini(jobText, resumeText);

      // Handle case where AI service is unavailable
      if (!response) {
        return {
          ok: false,
          message:
            "AI service is currently unavailable. Please try again later.",
          result: null,
        };
      }

      // Extract the AI's analysis from the response
      const textContent = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        return {
          ok: false,
          message: "AI service returned an empty response. Please try again.",
          result: null,
        };
      }

      // Parse the JSON analysis from the AI
      // The AI should return a structured evaluation with score, summary, etc.
      // First, clean the response text to handle code fences
      const cleanedText = this.parseAIResponse(textContent);
      const result = JSON.parse(cleanedText) as EvaluatorResult;

      // Validate that we got all required fields
      if (!this.isValidEvaluatorResult(result)) {
        return {
          ok: false,
          message: "AI returned incomplete analysis. Please try again.",
          result: null,
        };
      }

      return {
        ok: true,
        message: "Resume successfully analyzed! Check the results below.",
        result: result,
      };
    } catch (error) {
      console.error("Error in evaluation process:", error);

      // Check if it's a PDF parsing error
      if (
        error instanceof Error &&
        error.message.includes("Failed to extract text from PDF")
      ) {
        return {
          ok: false,
          message:
            "Failed to read PDF content. Please ensure the files are valid PDFs and try again.",
          result: null,
        };
      }

      // Check if it's a JSON parsing error
      if (error instanceof Error && error.message.includes("JSON")) {
        console.error(
          "Failed to parse AI response. Original error:",
          error.message,
        );
        return {
          ok: false,
          message:
            "Failed to process AI analysis. The AI response may be malformed or contain unexpected formatting.",
          result: null,
        };
      }

      // Generic error
      return {
        ok: false,
        message:
          "An unexpected error occurred during analysis. Please try again.",
        result: null,
      };
    }
  }

  /**
   * Parses the AI response text, removing code fences if present
   * @param text - Raw text response from AI
   * @returns Cleaned JSON string ready for parsing
   */
  private parseAIResponse(text: string): string {
    // Trim whitespace
    let cleanText = text.trim();

    // Check if response is wrapped in code fences
    // Common patterns: ```json, ```, ```typescript, etc.
    const codeFencePattern =
      /^```(?:json|typescript|ts|javascript|js)?\s*\n?([\s\S]*?)\n?```$/;
    const match = cleanText.match(codeFencePattern);

    if (match && match[1]) {
      // Extract content between code fences
      cleanText = match[1].trim();
    }

    // Remove any remaining markdown artifacts
    cleanText = cleanText.replace(/^`{1,3}|`{1,3}$/g, "");

    return cleanText.trim();
  }

  /**
   * Validates that the AI response contains all required fields
   * @param result - The parsed result from AI
   * @returns true if result is valid, false otherwise
   */
  private isValidEvaluatorResult(result: unknown): result is EvaluatorResult {
    return (
      typeof result === "object" &&
      result !== null &&
      typeof (result as EvaluatorResult).score === "number" &&
      typeof (result as EvaluatorResult).summary === "string" &&
      typeof (result as EvaluatorResult).strengths === "string" &&
      typeof (result as EvaluatorResult).gaps === "string" &&
      typeof (result as EvaluatorResult).suggestions === "string"
    );
  }
}
