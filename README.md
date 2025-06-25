# RoleFit

> **AI-powered tool that analyzes a candidate's CV against a job description to assess alignment, strengths, and improvement areas. Built for the Woolf University assessment.**

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TailwindCSS v4
- **Backend**: tRPC server with TypeScript
- **Package Manager**: pnpm with workspaces
- **Build System**: TurboRepo for monorepo management
- **AI Integration**: Google Gemini API
- **Development**: TypeScript, ESLint, Prettier

## 📁 Project Structure

```
rolefit/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/                # App Router pages and layouts
│   │   │   ├── layout.tsx      # Root layout with metadata
│   │   │   ├── page.tsx        # Home page
│   │   │   └── globals.css     # Global styles
│   │   ├── lib/
│   │   │   └── trpc.ts         # tRPC client configuration
│   │   └── package.json
│   │
│   └── api/                    # tRPC backend server
│       ├── config.ts           # Environment configuration
│       ├── index.ts            # Server entry point
│       ├── trpc.ts             # tRPC router setup
│       ├── evaluator.ts        # CV analysis logic
│       └── package.json
│
├── packages/
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
│
├── package.json                # Root package.json
├── turbo.json                  # TurboRepo configuration
└── pnpm-workspace.yaml         # pnpm workspace setup
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ssnxd/rolefit.git
   cd rolefit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `apps/api/` directory:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   
   Configure the following variables in `apps/api/.env`:
   ```env
   # Gemini AI Configuration
   GEMINI_API_URL=your_gemini_api_url_here
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Server Configuration
   PORT=3001
   ```

## 🚀 Development

### Start Development Servers

Run both frontend and backend in development mode:

```bash
pnpm dev
```

This command will start:
- **Frontend**: http://localhost:3000 (Next.js with App Router)
- **Backend**: http://localhost:3001 (tRPC server)

### Individual Commands

Start only the frontend:
```bash
pnpm --filter web dev
```

Start only the backend:
```bash
pnpm --filter @repo/api dev
```

### Other Commands

```bash
# Build all applications
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types
```

Built for Woolf University assessment.