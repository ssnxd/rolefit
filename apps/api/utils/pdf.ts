// @ts-expect-error: No types available for pdf-parse
import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Extracts text content from a PDF file
 * @param file - The PDF file to extract text from
 * @returns Promise with extracted text content
 */
export async function pdfToText(file: File): Promise<string> {
  try {
    // Convert File to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse
    const data = await pdfParse(buffer);

    // Return the extracted text
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
