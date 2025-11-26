# AGENTS.md

Social media post generator: Next.js 15 frontend, Express/FastAPI backends with OpenAI.

## Commands
- **Frontend**: `cd frontend && npm run dev` (port 3000), `npm run build`
- **Backend TS**: `cd backend-ts && npm run dev` (port 3001)
- **Backend Python**: `cd backend-py && make dev`, `uv run mypy src/`
- **Tests**: Not configured. Use `npm test -- path/to/test.ts` or `uv run pytest path::func -v`

## Code Style
- **Imports**: External deps first, then local modules. Use `"use client"` for React client components.
- **Naming**: camelCase (TS files/functions), snake_case (Python), PascalCase (types/components), UPPER_SNAKE_CASE (constants)
- **Types**: Use `interface` for objects, `type` for unions. Enable `strict: true`. Use optional chaining (`?.`).
- **Formatting**: 2-space indent, double quotes, semicolons (TS), trailing commas
- **Styling**: TailwindCSS utility classes in JSX

## Structure
- `frontend/src/app/` - Next.js pages and layouts
- `backend-ts/src/` - Express server, types, OpenAI integration
- `backend-py/src/` - FastAPI server with same structure

## Environment
- `OPENAI_API_KEY` (required), `PORT=3001`, `NEXT_PUBLIC_API_URL=http://localhost:3001`
