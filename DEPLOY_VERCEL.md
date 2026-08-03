# Deploying to Vercel

The app is a full-stack TanStack Start server app. The code is already prepared
for Vercel — you only need to supply your own keys.

## 1. Push the code to GitHub

In the Lovable editor: **Plus (+) menu → GitHub → Connect project**, then create
the repository. The full codebase is pushed automatically.

## 2. Import the repo in Vercel

1. vercel.com → **Add New → Project → Import Git Repository**
2. Framework preset: **Other** (the build already emits Vercel output)
3. Build command: `npm run build` — Output directory: leave empty

## 3. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables**
(Production + Preview):

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | from the project's `.env` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | from the project's `.env` |
| `VITE_SUPABASE_PROJECT_ID` | from the project's `.env` |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `GEMINI_API_KEY` | your key from Google AI Studio |
| `VITE_USE_SUPABASE_OAUTH` | `true` |

Optional: `GEMINI_MODEL` (defaults to `gemini-2.5-flash`).

The database itself is hosted separately and keeps working — no data migration
is needed.

## 4. Gemini API key

1. Go to https://aistudio.google.com/apikey
2. **Create API key** → copy it into `GEMINI_API_KEY` in Vercel

When `GEMINI_API_KEY` is set the app calls Gemini directly; when it is absent it
falls back to the managed AI gateway (Lovable hosting).

## 5. Google sign-in (own credentials)

The managed Lovable OAuth broker does not exist on Vercel, which is why
`/~oauth/initiate` returned 404. With `VITE_USE_SUPABASE_OAUTH=true` the app
uses the backend auth provider instead, so you must register your own Google
OAuth client:

1. https://console.cloud.google.com → **APIs & Services → OAuth consent screen**
   → configure it (scopes: `userinfo.email`, `userinfo.profile`, `openid`).
2. **Credentials → Create credentials → OAuth client ID → Web application**.
3. Authorized JavaScript origins: `https://your-app.vercel.app`
4. Authorized redirect URI: the callback URL shown in the project's auth
   settings (Cloud → Users → Auth Settings → Google).
5. Paste the generated **Client ID** and **Client secret** into that same Google
   provider section of the auth settings.
6. Add `https://your-app.vercel.app/auth/callback` to the allowed redirect URLs
   in the auth settings.

## 6. Deploy

Push to `main` (or hit **Redeploy**). Verify in this order: signup → login →
Google sign-in → new interview generation → results page.

## Notes

- Leaving `VITE_USE_SUPABASE_OAUTH` unset keeps the Lovable-managed Google flow,
  so the same codebase still works on Lovable hosting.
- Never expose `GEMINI_API_KEY` with a `VITE_` prefix — it is server-only.
