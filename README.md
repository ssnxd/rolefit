# RoleFit

AI-powered tool that analyzes a candidate's CV against a job description to assess alignment, strengths, and improvement areas. The current state of the project supports comparing job descriptions to CVs and generating comprehensive reports.

Live version: [rolefit.surajnegi.com](https://rolefit.surajnegi.com)

⚠️ Note: The api is running on free versions on render so the inital api request might take a while after inactivity. 

## Screenshots

<img width="500" align="top" alt="image" src="https://github.com/user-attachments/assets/cb88591d-f9d1-49cc-8cae-3dbbf7fbd64a" />

<img width="500" alt="image" src="https://github.com/user-attachments/assets/8048516e-4e04-4a0a-84a5-e958c84a5060" />



## Project Setup

This project uses Turbo for monorepo management and pnpm for package management. All deployable applications live in the `apps` directory and shared packages are located in the `packages` directory.

The API exposes types to be used by the web application through tRPC, allowing type-safe communication between the client and server.

### Requirements

- Node.js v22.15.1
- pnpm 9.0.0

### Architecture

The `packages` directory contains shared TypeScript and ESLint configurations that are extended by individual applications. This ensures consistency across the entire monorepo.

For detailed setup instructions and configuration, refer to the individual README files in each application directory.

## Available Scripts

Run these commands from the project root:

- `pnpm build` - Build all applications and packages
- `pnpm dev` - Start development servers for all applications
- `pnpm lint` - Run ESLint across all workspaces
- `pnpm format` - Format code using Prettier
- `pnpm check-types` - Run TypeScript type checking across all workspaces
