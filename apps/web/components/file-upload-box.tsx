/**
 * Interface representing an uploaded file with metadata
 */
export interface UploadedFile {
  file: File; // The actual File object
  name: string; // Display name of the file
  size: string; // Formatted file size string (e.g., "2.5 MB")
}

/**
 * Props for the FileUploadBox component
 */
interface FileUploadBoxProps {
  /** File type ("cv" or "job") for styling and behavior */
  type: "cv" | "job";
  /** Currently uploaded file (null if none) */
  file: UploadedFile | null;
  /** Callback when file is selected */
  onFileSelect: (file: File) => void;
  /** Reference to the hidden file input */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Current drag over state */
  dragOver: "cv" | "job" | null;
  /** Callback for drag and drop events */
  onDrop: (e: React.DragEvent, type: "cv" | "job") => void;
  /** Callback for drag over events */
  onDragOver: (e: React.DragEvent, type: "cv" | "job") => void;
  /** Callback for drag leave events */
  onDragLeave: (e: React.DragEvent) => void;
  /** Callback to remove uploaded file */
  onRemoveFile: (type: "cv" | "job") => void;
}

/**
 * FileUploadBox Component
 *
 * Reusable upload zone component with drag & drop functionality
 * Shows different states: empty, drag over, file uploaded
 */
export default function FileUploadBox({
  type,
  file,
  onFileSelect,
  inputRef,
  dragOver,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemoveFile,
}: FileUploadBoxProps) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        dragOver === type
          ? "border-blue-500 bg-blue-50" // Drag over state
          : file
            ? "border-green-500 bg-green-50" // File uploaded state
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50" // Default state
      }`}
      onDrop={(e) => onDrop(e, type)}
      onDragOver={(e) => onDragOver(e, type)}
      onDragLeave={onDragLeave}
    >
      {/* Hidden file input - triggered by clicking anywhere in the drop zone */}
      <input
        type="file"
        ref={inputRef}
        accept=".pdf"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files[0]) {
            onFileSelect(files[0]);
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {/* Conditional rendering based on file upload state */}
      {file ? (
        // File uploaded state - show file info and remove button
        <div className="space-y-3">
          {/* Success checkmark icon */}
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
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
          </div>

          {/* File information */}
          <div>
            <p className="font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{file.size}</p>
          </div>

          {/* Remove file button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering file input
              onRemoveFile(type);
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove file
          </button>
        </div>
      ) : (
        // Empty state - show upload instructions
        <div className="space-y-3">
          {/* Upload icon */}
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          {/* Upload instructions */}
          <div>
            <p className="font-medium text-gray-900">
              Upload {type === "cv" ? "CV" : "Job Description"}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF files only, max 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
