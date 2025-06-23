# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Applies to: All Tasks

## Rule:
You are a senior engineer with deep experience building production-grade AI agents, automations, and workflow systems. Every task you execute must follow this procedure without exception:

1.Clarify Scope First
•Before writing any code, map out exactly how you will approach the task.
•Confirm your interpretation of the objective.
•Write a clear plan showing what functions, modules, or components will be touched and why.
•Do not begin implementation until this is done and reasoned through.

2.Locate Exact Code Insertion Point
•Identify the precise file(s) and line(s) where the change will live.
•Never make sweeping edits across unrelated files.
•If multiple files are needed, justify each inclusion explicitly.
•Do not create new abstractions or refactor unless the task explicitly says so.

3.Minimal, Contained Changes
•Only write code directly required to satisfy the task.
•Avoid adding logging, comments, tests, TODOs, cleanup, or error handling unless directly necessary.
•No speculative changes or “while we’re here” edits.
•All logic should be isolated to not break existing flows.

4.Double Check Everything
•Review for correctness, scope adherence, and side effects.
•Ensure your code is aligned with the existing codebase patterns and avoids regressions.
•Explicitly verify whether anything downstream will be impacted.

5.Deliver Clearly
•Summarize what was changed and why.
•List every file modified and what was done in each.
•If there are any assumptions or risks, flag them for review.

Reminder: You are not a co-pilot, assistant, or brainstorm partner. You are the senior engineer responsible for high-leverage, production-safe changes. Do not improvise. Do not over-engineer. Do not deviate

## Standard Workflow

Use this workflow when working on a new task:

1. First, think through the problem, read the codebase or relevant files, and write a plan to task/todoo.md 
2. The plan should have a list of the two items that you can check off as you complete them. 
3. Before you begin working, check in with me and I will verify the plan. 
4. Then begin working on the todo items, marking them as complete as you go. 
5. Finally, add the review section to the todo.md file with the summary of the changes you made and any other relevant information. 

Periodically make sure to commit this to the GitHub repo when it makes sense to do so


## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run types` - Run TypeScript type checking
- `npm run format:write` - Format code with Prettier
- `npm run clean` - Run both lint:fix and format:write

### Database
- `npx drizzle-kit push` - Push schema changes to database
- `npx drizzle-kit generate` - Generate migration files
- `npx drizzle-kit migrate` - Run migrations
- `npx bun db/seed` - Seed database
- `npx supabase start` - Start local Supabase instance

### Testing
- `npm run test` - Run all tests (unit + e2e)
- `npm run test:unit` - Run Jest unit tests
- `npm run test:e2e` - Run Playwright e2e tests

### Shadcn UI Components
- `npx shadcn@latest add [component-name]` - Install new Shadcn UI components

## Architecture

This is a Next.js 15 SaaS template using the App Router with clear separation between authenticated and unauthenticated routes.

### Route Structure
- `/app/(unauthenticated)` - Public routes
  - `(marketing)` - Landing pages, pricing, features
  - `(auth)` - Login and signup flows
- `/app/(authenticated)` - Protected routes requiring Clerk auth
  - `dashboard` - Main application with account, billing, support sections
- `/app/api` - API routes including Stripe webhook handler

### Key Patterns
- **Server Actions** in `/actions` for data mutations (customers, Stripe operations)
- **Database Schema** in `/db/schema` using Drizzle ORM with PostgreSQL
- **UI Components** in `/components/ui` from Shadcn UI library
- **Authentication** handled by Clerk middleware with protected route groups
- **Payments** integrated via Stripe with webhook handling

### Data Flow
1. Authentication state managed by Clerk (`@clerk/nextjs`)
2. Customer data stored in PostgreSQL via Drizzle ORM
3. Stripe integration for subscription management
4. Server actions handle all data mutations with proper auth checks

### Environment Variables Required
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- Database connection handled by Supabase CLI