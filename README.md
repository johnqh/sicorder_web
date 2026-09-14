# sicorder_web

Landing page for sicorder, a Chrome extension that records just the part of a web page you pick, as an MP4.

## Setup

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
bun run build
bun run lint
bun run localize    # translate new English strings into the other 14 locales
bun run localized   # verify every locale has every key
```

## Deploy

Cloudflare Pages, build command `bun run build`, output `dist/`.

## License

BUSL-1.1
