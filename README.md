# 🎯 Interview Ace — AI Interview Preparation Platform

A modern, production-quality **AI Interview Preparation Platform** for developers.
Generate realistic mock interviews with AI, practice under a timed environment,
and get detailed scoring across technical, communication, and problem-solving dimensions —
then track your progress over time with rich analytics.

> Built to look and feel like a real SaaS product (think Vercel / Linear / Notion):
> clean minimal UI, glassmorphism cards, dark & light themes, fully responsive.

---

## ✨ Features

| Module | What it does |
| --- | --- |
| **Authentication** | Email/password sign up & login, Google OAuth, forgot/reset password, session persistence, and protected routes. |
| **Dashboard** | Personalised welcome, total interviews, average & best scores, practice time, score-trend area chart, skill breakdown bars, and recent activity. |
| **AI Interview Generator** | Pick role, difficulty, question count, and optional focus areas → AI generates a tailored question set. |
| **Interview Room** | One question at a time, live timer, progress bar, prev/next navigation, auto-saved answers, and submission. |
| **AI Evaluation** | Overall + technical + communication + problem-solving scores, summary, strengths, weaknesses, suggestions, and per-question feedback with ideal answers. |
| **Analytics** | KPI cards, score-trend chart, skill radar, average score by role, and interview history with a proper empty state. |
| **Profile** | Update name / target role / experience / bio, change password, and sign out. |

### UI / UX
- Professional SaaS dashboard with a responsive sidebar + mobile drawer
- Dark and light mode (persisted to `localStorage`)
- Glassmorphism cards, gradient accents, mesh backgrounds
- Loading skeletons, toast notifications, smooth animations
- Reusable, composable components

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [TanStack Start](https://tanstack.com/start) v1 (React 19 + Vite 8, SSR/SSG) |
| **Routing** | TanStack Router (file-based, type-safe, protected layouts) |
| **Styling** | Tailwind CSS v4 (semantic OKLCH tokens, dark mode) |
| **State** | React Context API (Auth + Theme) + TanStack Query (server cache) |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Auth + Database** | Lovable Cloud (Supabase) — Auth, Postgres, Row-Level Security |
| **AI** | Lovable AI Gateway (Gemini-class model) via the Vercel AI SDK |
| **Server Logic** | TanStack `createServerFn` typed RPC (no separate API server) |
| **Notifications** | Sonner |

> **Note on the stack:** the original brief listed React Router DOM + Firebase.
> This project runs on **TanStack Start**, so it uses **TanStack Router** (same
> pages / layouts / protected-route model) and **Lovable Cloud** for auth +
> database, and the **Lovable AI Gateway** for Gemini — giving the same feature
> set with zero key management. See `AGENTS.md` for the full rationale.

---

## 📁 Project Structure

```
src/
├─ components/        # Reusable UI (Logo, StatCard, EmptyState, Loaders, GoogleButton, ThemeToggle)
├─ context/           # AuthContext + ThemeContext (Context API)
├─ hooks/             # useAuth, use-mobile
├─ layouts/           # AppLayout (sidebar shell), AuthLayout (split-screen)
├─ lib/               # interview.server.ts (AI logic), interview.functions.ts (server fns),
│                    # ai-gateway.server.ts, error-capture, utils
├─ pages/             # DashboardPage, ProfilePage, auth/* pages
├─ routes/            # TanStack Router file-based routes (+ _authenticated layout guard)
├─ services/          # interviewService.ts (Supabase data layer + aggregations)
├─ integrations/      # supabase client/server, lovable auth
└─ utils/             # constants, format helpers
```

---

## 🗄️ Data Model (Lovable Cloud / Postgres)

- **`profiles`** — `id`, `email`, `full_name`, `avatar_url`, `target_role`, `experience_level`, `bio`
- **`interviews`** — `id`, `user_id`, `role`, `difficulty`, `question_count`, `status`,
  `questions` (JSONB), `answers` (JSONB), `evaluation` (JSONB),
  `overall_score`, `technical_score`, `communication_score`, `problem_solving_score`,
  `duration_seconds`, `created_at`, `completed_at`

All tables use **Row-Level Security** so a user can only read/write their own rows.
A Postgres trigger auto-creates a `profiles` row on signup.

---

## 🤖 AI Integration

- **Question generation** and **answer evaluation** run as TanStack server functions,
  keeping API keys server-side.
- Responses are parsed with a **resilient JSON extraction + normalization layer**
  (handles markdown-wrapped JSON, missing optional fields, partial output) instead of
  brittle strict-schema validation — so a slightly-off model response no longer crashes the app.
- Friendly errors for rate limits (429) and exhausted credits (402).

---

## 🚀 Getting Started

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Open the printed local URL. Auth and the database are provisioned via Lovable Cloud —
no separate Firebase/Gemini key setup is needed.

### Environment
The project reads Supabase + AI Gateway config from the Lovable environment
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `LOVABLE_API_KEY`). These are
managed by Lovable Cloud — no manual `.env` wiring is required when developing in Lovable.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Vite) |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build (used by Lovable preview) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## 🏗️ Architecture Notes

- **Server/client boundary:** app-internal logic uses TanStack `createServerFn` (typed RPC).
  The AI provider and all secrets stay server-side; the client only calls the function.
- **Auth guard:** the `_authenticated` layout route redirects unauthenticated users to
  `/login` before any protected loader runs.
- **Caching:** React Query is configured with a 60s stale time, no refetch-on-focus, and a
  single retry — navigating between pages no longer refires duplicate requests.
- **Performance:** profile fetches are de-duped per user; route data uses `ensureQueryData` +
  `useSuspenseQuery` to avoid loading-spin flash.

---

## 📌 About This Project

This project was built with [Lovable](https://lovable.dev).

### Build with Lovable
- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back.

---

## 📄 License

MIT — free to use as a portfolio project. Attribution appreciated but not required.
