# RoleFit API

tRPC-based server that provides type-safe endpoints for uploading PDF documents and receiving detailed evaluation reports.

## API Endpoints

### POST /analyze

Analyzes a candidate's CV against a job description and returns a comprehensive evaluation report.

**Request Format:** `multipart/form-data`

**Parameters:**

- `cv` (File): PDF file containing the candidate's CV/resume
- `jd` (File): PDF file containing the job description

**File Requirements:**

- Format: PDF only
- Maximum size: 5MB per file
- Both files are required

**Response:**

```typescript
{
  ok: boolean;
  message: string;
  result: {
    score: number;        // Match score (0-100)
    summary: string;      // Overall alignment overview
    strengths: string;    // Well-aligned qualifications
    gaps: string;         // Missing or weak areas
    suggestions: string;  // Improvement recommendations
  } | null;
}
```

## Environment Configuration

Create a `.env` file in the API directory with the following variables:

```bash
# Google Gemini AI Configuration
GEMINI_API_URL=your-gemini-api-url
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=3001
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code quality
- `pnpm lint:fix` - Run ESLint and automatically fix issues
- `pnpm check-types` - Run TypeScript type checking

## Development

```bash
pnpm dev
```

Server starts on `http://localhost:3001` with hot reload enabled.
