import type { UploadedFile } from "../components/file-upload-box";

/**
 * Formats file size in bytes to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB", "1.2 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

/**
 * Validates uploaded file to ensure it meets requirements
 * @param file - File object to validate
 * @returns Object with validation result and error message if invalid
 */
export const validatePDF = (
  file: File,
): { isValid: boolean; error?: string } => {
  // Check file type - must be PDF
  if (file.type !== "application/pdf") {
    return { isValid: false, error: "Please upload only PDF files" };
  }

  // Check file size - maximum 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: "File size must be less than 5MB" };
  }

  return { isValid: true };
};

/**
 * Creates an UploadedFile object from a File
 * @param file - The File object to process
 * @returns UploadedFile with metadata
 */
export const createUploadedFile = (file: File): UploadedFile => ({
  file,
  name: file.name,
  size: formatFileSize(file.size),
});

/**
 * File upload hook that manages file state and validation
 */
export const useFileUpload = () => {
  /**
   * Handles file selection with validation
   * @param file - Selected file object
   * @param setError - Function to set error state
   * @returns UploadedFile if valid, null if invalid
   */
  const handleFileSelect = (
    file: File,
    setError: (error: string | null) => void,
  ): UploadedFile | null => {
    // Clear any existing errors
    setError(null);

    // Validate the uploaded file
    const validation = validatePDF(file);
    if (!validation.isValid) {
      setError(validation.error!);
      return null;
    }

    // Create file object with metadata
    return createUploadedFile(file);
  };

  /**
   * Handles drag and drop file events
   * @param e - Drag event
   * @param setError - Function to set error state
   * @returns UploadedFile if valid, null if invalid
   */
  const handleDrop = (
    e: React.DragEvent,
    setError: (error: string | null) => void,
  ): UploadedFile | null => {
    e.preventDefault();

    // Extract files from drop event
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      return handleFileSelect(files[0], setError);
    }

    return null;
  };

  /**
   * Handles drag over events
   * @param e - Drag event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * Handles drag leave events
   * @param e - Drag event
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
};
