# Meridian

Meridian is a React, TypeScript and Vite workspace. Its shared operational source of truth is `src/data/operations.ts`; the dashboard and copilot both calculate against those seeded site records.

## Hybrid copilot

The copilot shows a local intent plan immediately, then asks the optional server-side model endpoint to refine the intent and plan. Only validated intent/tool names are accepted. The browser executes allowlisted deterministic tools over the seeded records and provides the citations and draft values. If the provider is unavailable, times out, returns invalid JSON, or is rate limited, the deterministic classifier continues the workflow and the panel labels it **Offline fallback**. With a successful provider response it labels the workflow **AI assisted**.

The current fallback handles over-budget sites, comparisons, highest utilisation, total overspend, good performance, explanations, drafting, draft follow-ups and out-of-scope requests. Drafts are editable; approval only simulates sending in the browser.

## LLM configuration

Copy `.env.example` to `.env` and configure `LLM_API_KEY`; optionally set `LLM_PROVIDER`, `LLM_BASE_URL`, and `LLM_MODEL` for an OpenAI-compatible chat completions endpoint. The key is read only by `server.mjs` and is never included in the Vite client bundle. The server times out provider requests after nine seconds. Without a configured key, the copilot runs entirely offline.

Run `npm run dev` for the Vite frontend and local API server. Run `npm run build` then `npm run serve` to serve the built application and API endpoint.
