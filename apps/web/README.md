# RoleFit Web

Next.js frontend application with modern UI for uploading CVs and job descriptions, displaying analysis results through tRPC integration.

## Features

- **PDF Upload Interface** - Drag-and-drop file upload for CVs and job descriptions
- **Real-time Analysis** - Type-safe API communication with the backend
- **Results Display** - Comprehensive evaluation reports with scores and recommendations
- **Responsive Design** - Modern UI built with TailwindCSS v4

## Application Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
  - `pdf-upload.tsx` - Main upload interface
  - `analysis-results.tsx` - Results display component
  - `file-upload-box.tsx` - File upload UI component
  - `footer.tsx` - Application footer
- `lib/` - Utility libraries and configurations
  - `trpc.ts` - tRPC client configuration

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint with zero warnings policy
- `pnpm lint:fix` - Run ESLint and automatically fix issues
- `pnpm check-types` - Run TypeScript type checking

## Development

First, set up your environment variables:

```bash
cp .env.example .env.local
```

Then start the development server:

```bash
pnpm dev
```

Application starts on `http://localhost:3000` with Turbopack for fast development builds.

## Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env.local` and update the values as needed:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

- `NEXT_PUBLIC_API_URL` - URL of the API server (default: `http://localhost:3001`)

### API Connection

The application connects to the API server using the URL specified in the `NEXT_PUBLIC_API_URL` environment variable. This is configured in `lib/trpc.ts`.
