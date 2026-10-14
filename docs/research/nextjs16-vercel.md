# Next.js 16 server features + Vercel CLI deployment — research notes

Written 2026-10-14 for Phase 2 (Steps F–K). Every API fact carries a source tag `[N*]`/`[V*]` (URL list at the
end). Next.js facts come from the docs **shipped inside the installed package** (`next@16.4.0`,
`node_modules/next/dist/docs/01-app/...`, mirrors of nextjs.org/docs). `vercel.com` is blocked by this
session's egress proxy (CONNECT 403), so Vercel facts come only from (a) the official CLI `vercel@64.0.2`
(`vercel <cmd> --help` run locally) and its open-source repo `github.com/vercel/vercel` (the code that renders
the CLI docs), and (b) the `@vercel/functions@3.10.1` package source. Anything documented **only** on
vercel.com (plan limits, DNS CNAME value, image quotas) is marked **UNCONFIRMED** and collected at the end.

## 0. Versions (confirmed with `npm view <pkg> version`, 2026-10-14)

| Package | Version | Notes |
| --- | --- | --- |
| `next` (installed) | **16.4.0** | `engines.node >=20.9.0` [N34] |
| `vercel` (CLI) | **64.0.2** | `engines.node >= 20`; `npm i -g vercel` [V1][V2] |
| `@vercel/functions` | **3.10.1** | `ipAddress()`, `geolocation()`, `waitUntil()` [V7] |
| `zod` (installed) | **4.6.7** | `safeParse`; `z.flattenError` / `z.treeifyError` (`.flatten()` deprecated) [Z1] |
| `react-hook-form` / `@hookform/resolvers` | **7.90.0** / **5.9.1** | already installed |
| `pg` / `docx` | **8.23.1** / **9.11.0** | `pg` auto-externalised by Next, `docx` not (§7) [N39] |

## 1. Route Handlers (`app/api/.../route.ts`)

- `route.ts` anywhere under `app/`; it **cannot** sit next to a `page.tsx` in the same segment [N1][N2].
- Exports `GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS`; other verbs → `405`; `OPTIONS` auto-generated with
  an `Allow` header when not exported [N2].
- `request` is a `NextRequest` (Web `Request` + `cookies` + `nextUrl`); `context.params` is a **Promise**
  (since v15). Global `RouteContext<'/path/[id]'>` type exists after `next dev|build|typegen` [N2].

```ts
// app/api/items/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { headers, cookies } from 'next/headers'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const { id } = await ctx.params                        // params is a Promise [N2]
  return Response.json({ id })
}
export async function POST(request: NextRequest) {
  const body = await request.json()                      // or request.formData() / request.text() [N2]
  const ua = (await headers()).get('user-agent')         // headers() async, read-only [N5]
  const session = (await cookies()).get('session')?.value // or request.cookies.get('session') [N2][N4]
  const q = request.nextUrl.searchParams.get('q')        // [N2][N3]
  return NextResponse.json({ ok: true, ua, q, body }, { status: 201 }) // [N9]
}
```

**Client IP.** `NextRequest.ip`/`.geo` were **removed in v15** [N3]; Next's docs name no IP header. Vercel's
official helper reads **`x-real-ip`** ("Client IP as calculated by Vercel Proxy") [V7]:

```ts
import { ipAddress } from '@vercel/functions'            // npm i @vercel/functions [V7]
const ip = ipAddress(request)                            // === request.headers.get('x-real-ip') [V7]
  ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() // standard header; Vercel behaviour UNCONFIRMED
```

**Streaming** — return a `Response` whose body is a `ReadableStream` (doc sample, trimmed) [N2]:

```ts
export async function GET() {
  const enc = new TextEncoder()
  async function* chunks() { yield enc.encode('one\n'); yield enc.encode('two\n') }
  const it = chunks()
  const stream = new ReadableStream({
    async pull(c) { const { value, done } = await it.next(); done ? c.close() : c.enqueue(value) },
  })
  return new Response(stream)
}
```

**Caching defaults in 16.** Route Handlers are **not cached**; only `GET` can opt in with
`export const dynamic = 'force-static'` (other verbs never cached, even in the same file) [N1]; time-based
`export const revalidate = 60` [N2]. This project does **not** enable `cacheComponents`, so the "previous
model" config applies: `dynamic = 'auto'|'force-dynamic'|'error'|'force-static'`, `dynamicParams`, `revalidate`,
`fetchCache`, `runtime = 'nodejs'` (default; `'edge'` deprecated), `maxDuration` [N2][N7][N24]. With Cache
Components on, `dynamic/revalidate/fetchCache` are removed and GET handlers prerender unless they read request
data [N1][N7]. Also: `redirect()` works in handlers (throws → call outside `try`) [N8];
`revalidatePath('/api/data')` invalidates a cached GET [N20]; CORS = plain response headers; webhooks read
`await request.text()` with no `bodyParser` config [N2].

## 2. `proxy.ts` (was `middleware.ts`)

- Next 16 **renames Middleware → Proxy**: `proxy.ts` in the project root beside `app/`; export a named `proxy`
  or a default export. `middleware.ts`/`export function middleware` are deprecated; codemod
  `npx @next/codemod@canary middleware-to-proxy .` [N10][N11][N12].
- **Node.js runtime only**: `export const runtime` in `proxy.ts` throws; `'edge'` unsupported in proxy [N12][N13].
- Runs on **every request** unless `config.matcher` filters it — including `_next/static`, `_next/image`,
  `public/` — so always use a negative matcher; matcher values must be constants [N12].
- Order: next.config `headers` → `redirects` → Proxy → `beforeFiles` rewrites → filesystem → `afterFiles` [N12].
- Not available in `output: 'export'` [N15]; "platform-specific" for adapters (Vercel is verified) [N16][N17].
- Keep it **optimistic** (read the session cookie only, no DB); re-check auth in every action/handler/DAL [N12][N14].

Auth redirect (doc sample, unchanged except comments) [N14]:

```ts
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const cookie = (await cookies()).get('session')?.value   // or req.cookies.get('session')?.value [N14]
  const session = await decrypt(cookie)
  if (isProtectedRoute && !session?.userId) return NextResponse.redirect(new URL('/login', req.nextUrl))
  if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'] } // [N12][N14]
```

Matcher forms: string, array, path-to-regexp (`/admin/:path*`), or objects `{ source, locale?, has?, missing? }`
with `has/missing: [{ type: 'header'|'query'|'cookie', key, value? }]` [N12]. `NextResponse.redirect(url)`,
`.rewrite(url)`, `.next({ request: { headers } })` (forward upstream; never `.next({ headers })` to the client);
`loginUrl.searchParams.set('from', request.nextUrl.pathname)` [N9].

## 3. Server Actions for forms (zod, `revalidatePath`, `redirect`)

- `'use server'` at the top of a file (all exports become Server Functions, importable from Client Components)
  or inline as the first line of an `async function` in a Server Component [N18].
- Invoke via `<form action={fn}>`, `formAction`, or `startTransition`. With `useActionState` the signature
  becomes `(prevState, formData)`; the hook returns `[state, formAction, pending]` [N19].
- `cookies().set/delete` only inside Server Functions and Route Handlers, never during render [N4].
- Every action is a public POST: Next checks `Origin` vs `Host`/`X-Forwarded-Host` (CSRF), caps the body at
  **1 MB** (`serverActions.bodySizeLimit`), encrypts action IDs/closures — still **authenticate + validate inside
  each action** [N22]. Multi-instance self-hosting sets `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (Vercel need: UNCONFIRMED) [N22].
- `redirect()` **throws** `NEXT_REDIRECT`: call outside `try/catch`, after `revalidatePath`; in an action it
  does a client navigation (303 for no-JS form posts), default history `push` [N8][N21].
- `revalidatePath(path, type?: 'page'|'layout')`: literal path or pattern + `type` (`('/support/[id]','page')`);
  no trailing slash needed whatever `trailingSlash` is [N20].

```ts
// app/support/actions.ts
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'

const schema = z.object({ subject: z.string().min(3), message: z.string().min(10) })
export type TicketState = { errors?: Record<string, string[]> }

export async function createTicket(_prev: TicketState, formData: FormData): Promise<TicketState> {
  const session = await verifySession()                   // auth inside the action [N22]
  const parsed = schema.safeParse({ subject: formData.get('subject'), message: formData.get('message') })
  if (!parsed.success) {
    // doc sample uses err.flatten().fieldErrors (deprecated in zod 4) → z.flattenError [N19][Z1]
    return { errors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> }
  }
  await saveTicket(session.userId, parsed.data)
  revalidatePath('/support')                               // before redirect [N21]
  redirect('/support')                                     // throws — outside try/catch [N8]
}
```

```tsx
'use client'
import { useActionState } from 'react'
import { createTicket, type TicketState } from './actions'
export function NewTicketForm() {
  const [state, formAction, pending] = useActionState(createTicket, {} as TicketState)
  return (
    <form action={formAction}>
      <input name="subject" required /><textarea name="message" required />
      <p aria-live="polite">{state.errors?.subject?.[0]}</p>
      <button disabled={pending}>Send</button>
    </form>
  )
}
```

## 4. Dynamic rendering and leaving `output: 'export'`

- **Async-only request APIs in 16**: `cookies()`, `headers()`, `draftMode()`, `params` (layout/page/route/
  default/opengraph-image/icon) and `searchParams` must be awaited; sync access is removed [N23]. Using
  `cookies()`/`headers()` in a page or layout makes that route dynamic [N4][N5].
- `dynamic = 'force-dynamic'` = render per request (`fetch` → `no-store`); `'force-static'` = prerender with
  `cookies/headers/useSearchParams` empty; `'error'` = fail the build on request data [N24].
- `generateStaticParams` works on a server build for pages, layouts **and route handlers**; params not
  returned render on demand because `dynamicParams` defaults to `true`; add `export const dynamicParams = false`
  to 404 them (`/catalog/[slug]` and `/resources/[series]/[class]` rely on the export-time 404 today) [N25][N26].
- `trailingSlash: true` stays valid: the server **redirects** `/about` → `/about/`; files with an extension and
  `.well-known/` are exempt. Only under `output: 'export'` did it also change file names to `/about/index.html` [N27].
- `images.unoptimized: true` becomes optional — remove it to use the Image Optimization API (§5) [N38].
- `export const dynamic = 'force-static'` in `app/sitemap.ts|robots.ts|manifest.ts` was required **only** by the
  static export ("Route Handlers … must explicitly mark the handler as static") [N15b]. On a server these special
  handlers are "cached by default unless they use a Request-time API or dynamic config option" [N31] — keep or
  drop. `sitemap({ id })` gets `id` as a Promise in 16 when `generateSitemaps` is used [N40].
- Unlocked once export is removed (the export "unsupported" list): dynamic routes without `generateStaticParams`,
  Route Handlers reading the Request, `cookies()`, `rewrites`/`redirects`/`headers` in next.config, Proxy, ISR,
  default-loader Image Optimization, Draft Mode, Server Actions, Intercepting Routes [N15].
- Target "Node.js server" supports **all** features; needs `"build": "next build"` + `"start": "next start"`
  (replace `npx serve out -l 3000`, also in `playwright.config.ts` `webServer.command`) [N16]. The only extra
  dependency for Image Optimization is `sharp` [N17]. Minimums: Node **20.9+**, TypeScript 5.1+ [N34].
  `serverRuntimeConfig`/`publicRuntimeConfig` are removed — use env vars; `NEXT_PUBLIC_*` is inlined at build [N41][N42].

```ts
// next.config.ts (server mode)
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  trailingSlash: true,                                  // keeps Phase 1 URLs [N27]
  images: { remotePatterns: [{ protocol: 'https', hostname: '<project-ref>.supabase.co', pathname: '/storage/v1/object/public/**' }] }, // [N37]
  turbopack: { rules: { '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' } } },
  // serverExternalPackages: ['docx'],                   // only if bundling fails [N39]
}
export default nextConfig
```

## 5. `next/font` and `next/image` on a server deployment

- `next/font/google` downloads CSS + font files **at build time** and self-hosts them; the browser never calls
  Google. Identical in server mode; `app/layout.tsx` (Lora, Cormorant Garamond, Nunito, Caveat, Noto Sans
  Devanagari) keeps working [N35].
- `next/image` default loader = built-in Image Optimization API (`/_next/image`), needs the server; self-host:
  zero config with `next start`, optimises at runtime [N29][N36]. Remote `src` needs `images.remotePatterns`
  (object or URL-string form; `*` one segment/subdomain, `**` the rest; omitted `protocol/port/pathname/search`
  imply `**`; unmatched → `400`) [N37]; remote images need `width`/`height` or `fill` [N36]; `unoptimized` per
  image or globally [N38].
- 16 image changes: `images.domains` deprecated (→ `remotePatterns`), local images with query strings need
  `localPatterns`, new defaults for `minimumCacheTTL`/`imageSizes`/`qualities`, local-IP sources blocked
  (`dangerouslyAllowLocalIP`), max redirects limited [N30].
- Vercel is a **verified adapter** running the full compatibility suite [N16][N17]; Vercel's own image quotas and
  whether `sharp` is auto-provided are UNCONFIRMED.

## 6. Vercel CLI (`vercel@64.0.2`)

```bash
npm i -g vercel            # README [V1]; Node >= 20 [V2]
vercel --version           # [V3]
vercel login               # interactive; optional "[email or team id]"; --token is disabled for login [V4]
vercel whoami              # [V3]
```

**CI auth.** Every other command accepts `-t, --token <TOKEN>`; if absent the CLI reads **`process.env.VERCEL_TOKEN`**
(flag wins) [V5]. Tokens are made in the dashboard ("Account → Settings → Tokens"; OAuth login cannot mint them) [V5b].
Global options: `--scope <team>`, `--cwd <DIR>`, `--non-interactive` (default when an agent is detected), `--yes` [V3].

**Link.** `vercel link` / `vercel link --yes` / CI: `vercel link --yes --team <team-id-or-slug> --project <name-or-id>` [V6].
Writes `.vercel/project.json` (`{ "orgId", "projectId" }`) + `.vercel/README.txt` and adds `.vercel` to `.gitignore` [V8].
Env vars `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` (both required) replace the link file [V8b].

**Environment variables** [V9][V10]:

```bash
vercel env add SUPABASE_SECRET_KEY production --value "<value>" --yes   # non-interactive
printf '%s' "$KEY" | vercel env add XAI_API_KEY production,preview        # from stdin, two targets
vercel env add NEXT_PUBLIC_SITE_URL preview --git-branch feat1            # branch-scoped preview var
vercel env add DB_PASS production --sensitive                             # Secret (--no-sensitive = Config)
vercel env ls [environment] [git-branch]
vercel env rm XAI_API_KEY production -y
vercel env pull                                   # -> .env.local, development env by default
vercel env pull .env.production.local --environment production
vercel pull --environment=production              # project settings + .vercel/.env.production.local (for `vercel build`)
```

**Deploy** [V11][V12]:

```bash
vercel                       # preview deployment of cwd; --yes links/creates the project without prompts
vercel --prod                # production (= --target=production); promotes domains unless --skip-domain
vercel build && vercel deploy --prebuilt   # build locally, upload .vercel/output
vercel deploy --dry --json   # detected framework preset + files, no upload
vercel > deployment-url.txt  # non-TTY stdout = the deployment URL (CLI's own example)
vercel --prod --json         # {"id","url":"https://…","inspectorUrl","readyState","target"} on stdout
```

TTY output: `Inspect  https://vercel.com/<team>/<project>/<id>` then `Preview  https://<name>-<hash>.vercel.app`
(`Production https://…` with `--prod`) [V12]. Other flags: `-e KEY=V` (runtime env), `-b KEY=V` (build env),
`--no-wait`, `--force`, `--logs`, `--regions`, `--target <env>` [V11].

**Project settings for Next.js.** Preset `nextjs` auto-detected from the `next` dependency; defaults
`buildCommand: next build`, `devCommand: next dev --port $PORT`, `envPrefix: NEXT_PUBLIC_`, builder `@vercel/next` [V13].
Node.js version: Project Settings or `package.json` `"engines": { "node": "22.x" }` (CLI hint); the CLI's table lists
**24.x, 22.x, 20.x** with 20.x `discontinueDate: 2026-10-01` (past) → use `22.x` or `24.x` [V14].

**`vercel.json`** (schemas from `routing-utils` / `build-utils`) [V15][V16]:

```json
{
  "trailingSlash": true,
  "redirects": [{ "source": "/resources/technova/3", "destination": "https://example.com/t/3", "permanent": false }],
  "functions": { "app/api/chat/route.ts": { "maxDuration": 60 } }
}
```

- `trailingSlash` (boolean): "When `false`, visiting a path that ends with a forward slash will respond with a `308`
  status code and redirect to the path without the trailing slash." [V15]. `next.config.ts` owns this for Next
  builds; keeping both in sync (Phase 1) is safe — precedence UNCONFIRMED. `cleanUrls` strips extensions (308) [V15].
- `redirects[]` (max 2048): `source`, `destination` (required), `permanent` (`true` → 308, `false` → 307),
  `statusCode`, `has`, `missing` [V15]; or `redirects()` in `next.config.ts` on a server build [N15].
- `functions` keyed by file glob: `maxDuration` (integer **1–3600** or `"max"` per CLI validation), `memory`
  128–10240, `runtime`, `includeFiles`, `excludeFiles`, `regions` [V16]; with Fluid compute the CLI warns
  `memory` "cannot be configured in vercel.json" [V17]. Next's `export const maxDuration = N` is read from the
  build output by the platform [N7].

**Custom domain** [V18][V19][V20]:

```bash
vercel domains add elarauniversepublications.com [project]  # "a domain name that you already own"
vercel domains inspect elarauniversepublications.com        # nameservers + what is missing
vercel dns add elarauniversepublications.com '@ A 76.76.21.21'  # only if Vercel hosts the zone (A AAAA ALIAS CAA CNAME MX SRV TXT)
vercel alias set <deployment-url> elarauniversepublications.com # attach a deployment to the domain
```

When "not configured properly", `domains inspect` prints two options: `a) Set the following record on your DNS
provider to continue: A <domain> 76.76.21.21 [recommended]` or `b) Change your Domain's nameservers to the
intended set detailed above` (names fetched from the API), then "We will run a verification for you and you will
receive an email upon completion." [V19]. CNAME target for `www.` and nameserver host names: UNCONFIRMED.

## 7. Node runtime, `pg` / `docx`, function timeouts

- Route Handlers, Server Actions and pages run on **Node.js by default**; `runtime = 'edge'` is deprecated and
  Cache Components require Node [N7][N13]. Nothing extra is needed for Node packages.
- Next bundles server deps; `pg` and `sharp` are on its built-in opt-out list (`server-external-packages.jsonc`)
  so they use native `require`; `docx` is not listed — add `serverExternalPackages: ['docx']` only if the build
  complains [N39].
- `.docx` download = `new Response(buffer, { headers: { 'Content-Type':
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition':
  'attachment; filename="test.docx"' } })` — plain Web `Response`, like the RSS sample [N2].
- Timeouts: `export const maxDuration = <seconds>` in `route.ts`/`page.tsx` ("Default: set by deployment
  platform"; on a page it also covers that page's Server Actions) [N7]; `vercel.json` `functions[].maxDuration`
  validated 1–3600 or `"max"` [V16]. **Hobby defaults/maximums UNCONFIRMED** (duration docs unreachable).
  Streaming needs a non-buffering platform; Next marks Server Components/Actions "Streaming: Required" and
  Vercel is verified [N17]. Function Node version follows the project setting (22.x/24.x) [V14].

## 8. Phase 1 → server-mode checklist (derived from the facts above)

1. `next.config.ts`: delete `output: 'export'` and `images.unoptimized`; keep `trailingSlash: true` [N15][N27].
2. `package.json` `"start": "next start"`; `playwright.config.ts` `webServer.command: "npm run start"` [N16].
3. `app/catalog/[slug]/page.tsx`, `app/resources/[series]/[class]/page.tsx`: add `export const dynamicParams = false` [N25].
4. `app/sitemap.ts|robots.ts|manifest.ts`: `force-static` may stay (cached by default) [N31].
5. `public/_redirects` is Netlify-only; QR redirects → `vercel.json` `redirects` or `next.config` `redirects` [V15][N15].
6. Add `proxy.ts` for admin/teacher routes with a negative matcher; re-verify auth in actions/handlers [N12][N14].
7. Env via `vercel env add` per target; never put secrets in `NEXT_PUBLIC_*` (inlined at build) [N42][V9].
8. Deploy: `vercel link --yes --project <name>` → `vercel` (preview URL on stdout) → `vercel --prod` [V6][V11].

## UNCONFIRMED (no official source reachable here)

- Vercel request headers: whether/how `x-forwarded-for`, `x-vercel-forwarded-for`, `x-forwarded-host` are set
  (only `x-real-ip` + `x-vercel-ip-*` confirmed via `@vercel/functions`).
- Hobby/Pro default and maximum function duration, Fluid compute defaults, image-optimization quotas.
- DNS: CNAME target for subdomains (`www`), Vercel nameserver host names, TXT verification record.
- Whether `vercel.json` `trailingSlash` overrides or mirrors `next.config.ts` for Next.js builds.
- Vercel's Next.js 16 support statement, default Node.js version for new projects (CLI table only), and
  whether `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` is needed on Vercel.

## Sources

Next.js: local root `node_modules/next/dist/docs/01-app/`; public base `https://nextjs.org/docs/app/` (same path,
numeric prefixes dropped). Vercel source base `https://raw.githubusercontent.com/vercel/vercel/main/packages/`.

- [N1] `01-getting-started/15-route-handlers.md` → `getting-started/route-handlers`
- [N2] `03-api-reference/03-file-conventions/route.md` → `api-reference/file-conventions/route`
- [N3] `…/04-functions/next-request.md`; [N9] `…/04-functions/next-response.md` → `api-reference/functions/next-request` / `next-response`
- [N4] `…/04-functions/cookies.md`; [N5] `…/04-functions/headers.md` → `api-reference/functions/cookies` / `headers`
- [N6] `…/05-config/01-next-config-js/cacheComponents.md` → `api-reference/config/next-config-js/cacheComponents`
- [N7] `…/02-route-segment-config/{index,runtime,maxDuration}.md` → `api-reference/file-conventions/route-segment-config`
- [N8] `…/04-functions/redirect.md`; [N20] `…/04-functions/revalidatePath.md` → `api-reference/functions/redirect` / `revalidatePath`
- [N10] `01-getting-started/16-proxy.md`; [N11] `…/03-file-conventions/middleware.md`; [N12] `…/03-file-conventions/proxy.md`
  → `getting-started/proxy`, `api-reference/file-conventions/middleware`, `api-reference/file-conventions/proxy`
- [N13][N23][N30][N34][N40][N41] `02-guides/upgrading/version-16.md` (§"middleware to proxy", "Async Request APIs",
  "next/image changes", "Node.js runtime and browser support", "Async id parameter for sitemap", "Runtime Configuration")
  → `guides/upgrading/version-16`; [N34] also `node_modules/next/package.json` `engines`
- [N14] `02-guides/authentication.md` §"Optimistic checks with Proxy" → `guides/authentication#optimistic-checks-with-proxy-optional`
- [N15] `02-guides/static-exports.md` §"Unsupported Features"; [N15b] §"Route Handlers" → `guides/static-exports`
- [N16] `01-getting-started/17-deploying.md`; [N17] `02-guides/deploying-to-platforms.md` → `getting-started/deploying`, `guides/deploying-to-platforms`
- [N18] `…/01-directives/use-server.md`; [N19] `02-guides/forms.md`; [N21] `01-getting-started/07-mutating-data.md`
  → `api-reference/directives/use-server`, `guides/forms`, `getting-started/mutating-data`
- [N22] `02-guides/server-actions.md` + `…/01-next-config-js/serverActions.md` → `guides/server-actions`, `api-reference/config/next-config-js/serverActions`
- [N24] `02-guides/caching-without-cache-components.md` §"dynamic" → `guides/caching-without-cache-components#dynamic`;
  [N25] `…/02-route-segment-config/dynamicParams.md`; [N26] `…/04-functions/generate-static-params.md`
- [N27] `…/01-next-config-js/trailingSlash.md`; [N28] `…/01-next-config-js/images.md`; [N39] `…/01-next-config-js/serverExternalPackages.md`
  + `node_modules/next/dist/lib/server-external-packages.jsonc`
- [N29][N42] `02-guides/self-hosting.md` (§"Image Optimization", "Environment Variables") → `guides/self-hosting`
- [N31] `…/01-metadata/{sitemap,robots,manifest}.md` → `api-reference/file-conventions/metadata/sitemap` etc.
- [N35] `…/02-components/font.md` + `01-getting-started/13-fonts.md`; [N36] `01-getting-started/12-images.md`;
  [N37][N38] `…/02-components/image.md` §"remotePatterns", "unoptimized" → `api-reference/components/image`
- [Z1] `node_modules/zod/v4/classic/errors.d.ts` (`.flatten()` deprecated → `z.treeifyError`), `node_modules/zod/v4/core/errors.d.ts` (`flattenError`)
- [V1] `vercel@64.0.2` `README.md` (links https://vercel.com/docs/cli); [V2] its `package.json` `engines`
- [V3] `vercel <cmd> --help` (Global Options) run locally; [V4] `vercel login --help` + `cli/src/commands/login/command.ts` (`disabledGlobalOptions: ['token']`)
- [V5] `cli/src/index.ts` lines 347–354 (`--token` flag, else `process.env.VERCEL_TOKEN`); [V5b] CLI bundle message
  "classic personal access token (dashboard: Account → Settings → Tokens) … set VERCEL_TOKEN or pass --token"
- [V6] `vercel link --help` + `cli/src/commands/link/command.ts`
- [V7] `@vercel/functions@3.10.1` `headers.d.ts`/`headers.js` (`IP_HEADER_NAME = "x-real-ip"`, `ipAddress`, `geolocation`); docs link https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package
- [V8] `cli/src/util/projects/link.ts` (`.vercel`, `project.json`, `README.txt`, `addToGitIgnore`); [V8b] CLI bundle: "You specified `VERCEL_ORG_ID` but you forgot to specify `VERCEL_PROJECT_ID`"
- [V9] `vercel env --help`, `vercel env pull --help` + `cli/src/commands/env/command.ts`; [V10] `vercel pull --help` + `cli/src/commands/pull/index.ts` (`.env.${environment}.local`)
- [V11] `vercel deploy --help` + `cli/src/commands/deploy/command.ts`; [V12] `cli/src/commands/deploy/index.ts` (prints `Inspect`, `Preview`/`Production`; `getDeploymentOutputJson`)
- [V13] `@vercel/frameworks` preset `slug: "nextjs"` bundled in `vercel/dist` (`matchPackage: "next"`, `buildCommand "next build"`, `devCommand "next dev --port $PORT"`, `envPrefix "NEXT_PUBLIC_"`, `use: "@vercel/next"`)
- [V14] `@vercel/build-utils` (installed with vercel 64.0.2) `NODE_VERSIONS` table + hint "Please set Node.js Version to … in your Project Settings" / `"engines": { "node": "…" }`
- [V15] `routing-utils/src/schemas.ts` (`trailingSlashSchema`, `cleanUrlsSchema`, `redirectsSchema`)
- [V16] `build-utils/src/schemas.ts` (`functionsSchema`) + `getMaxDurationLimit()` = 3600; [V17] CLI bundle warning `MEMORY_DROPPED`
- [V18] `vercel domains add --help` + `cli/src/commands/domains/command.ts`; [V19] `cli/src/commands/domains/inspect.ts` lines 150–163 (`A <domain> 76.76.21.21`)
- [V20] `vercel dns add --help`, `vercel alias --help` + `cli/src/commands/dns/command.ts`
