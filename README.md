# sicorder_web

Marketing site for sicorder, a Chrome extension that records just the part of a web page you pick, as an MP4. A single-page-app landing page plus docs, privacy-policy and support pages, in 15 locales, built on the Sudobility shell (`@sudobility/*`) with React 19 + Vite + Tailwind. Deployed to Cloudflare Pages.

## Setup

The `@sudobility/*` dependencies are published to GitHub Packages, so `bun install` needs a GitHub token with `read:packages` in your global `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=<github-token>
```

(The repo's `.npmrc` already points the `@sudobility` scope at `npm.pkg.github.com`.) Then:

```bash
cp .env.example .env
bun install
bun run dev        # http://localhost:4010/en
```

Environment variables (`.env`, or Cloudflare Pages settings):

| Variable | Purpose |
|---|---|
| `VITE_APP_NAME`, `VITE_APP_DOMAIN`, `VITE_COMPANY_NAME`, `VITE_SUPPORT_EMAIL` | Branding, SEO and contact |
| `VITE_CHROME_STORE_URL` | "Get sicorder" button target; empty shows "Coming soon" |
| `VITE_FIREBASE_*` | Optional analytics |
| `WHISPERLY_API_KEY` | Needed only for `bun run localize` |

## Development

```bash
bun run build       # process:static + SEO assets + tsc -b + vite build → dist/
bun run typecheck   # tsc --noEmit
bun run lint
bun run localize    # translate new English strings into the other 14 locales
bun run localized   # verify every locale has every key
```

## Deploy

Cloudflare Pages, build command `bun run build`, output `dist/`.

## License

BUSL-1.1
