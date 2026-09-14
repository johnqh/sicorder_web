# sicorder_web — Landing Page — Design

Date: 2026-09-14
Status: Approved in chat, pending spec review

## Purpose

A one-page, localized marketing site for the sicorder Chrome extension
(`~/projects/sicorder_extension`) that explains what it does and links to the
Chrome Web Store. Modeled on `~/projects/sudobility`.

## Decisions

| Topic | Decision |
|---|---|
| Stack | Full sudobility shell (user choice): React 19, Vite 6, Tailwind 3 + `@sudobility/design`, `@sudobility/building_blocks`, `@sudobility/components`, `@sudobility/seo_lib`, `@sudobility/di` (Firebase analytics), same stub aliases |
| Localization | Same 15 locales as sudobility; `/:lang` routing; English source; translations produced with `bun run localize` (Whisperly) |
| CTA | "Get sicorder" → `VITE_CHROME_STORE_URL`; unset → disabled "Coming soon to the Chrome Web Store" |
| Domain | `sicorder.sudobility.com` (`VITE_APP_DOMAIN`) |
| Theme | Dark, like sudobility; accent is the extension's record red (`#E8453C`) instead of sudobility purple |
| Hosting | Cloudflare Pages (`wrangler.toml`, `dist/`) |
| Excluded | Prerender/snapshot pipeline (`scripts/prerender.mjs`, `functions/_middleware.js`, `public/html`); build-time SEO generator already emits per-language HTML |

## Stack details (copied from sudobility)

- **Entry:** `main.tsx` configures the `@sudobility/design` default theme and injects its CSS. `App.tsx` wraps everything in `SudobilityApp` with a forced-dark `ThemeProvider`.
- **Shell:** `AppTopBar` (logo, language picker), `AppBreadcrumbs` (share), `AppFooterForHomePage`.
- **SEO:** `SEOHeadProvider` + `SEOHead` from `@sudobility/seo_lib`, with title/description/keywords from `landing.json` `seo.*` and a HowTo schema from `howto.json`.
- **Services:** `src/config/initialize.ts` initializes storage, Firebase (analytics only) and network, and starts web vitals. Firebase is skipped cleanly when `VITE_FIREBASE_*` is empty.
- **Stubs:** `firebase/auth`, `@sudobility/di_web`, `@sudobility/auth_lib`, `@sudobility/subscription-components`, `@sudobility/devops-components`, `@sudobility/subscription_lib` → `src/stubs/*` via Vite aliases.
- **Static processing:** `bun run process:static` fetches `process-static-files.ts` from `johnqh/workflows`. It renders `index.template.html`, `public/robots.template.txt`, `public/sitemap.template.xml` and `public/llms.template.txt` with values from `.env`.
- **SEO generation:** `generate-seo-assets-v2.mjs` from `johnqh/workflows` reads `seo.config.mjs` (one `home` route, `trailingSlashUrls: false`) and writes per-language `index.html`, the sitemap index + per-language sitemaps, and robots.txt into `public/` and `dist/`.
- **Redirects:** `public/_redirects`: `/` → `/en` (308); SPA fallback `/* /index.html 200`.

## Configuration

`.env.example` (committed) and `.env` (local, gitignored):

```
VITE_APP_NAME=sicorder
VITE_APP_DOMAIN=sicorder.sudobility.com
VITE_COMPANY_NAME=Sudobility
VITE_SUPPORT_EMAIL=info@sudobility.com
VITE_CHROME_STORE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Page structure

```
AppTopBar (logo · language picker)
AppBreadcrumbs (Home · share)
<main>
  Hero            headline, subhead, Get sicorder button, "Free · Runs entirely in your browser" note
  Problem         the full-screen-record-then-crop-and-trim routine sicorder replaces
  HowItWorks      3 step cards (Pick, Record, Stop)
  Features        6 "why it saves time" cards
  Audiences       4 "built for" cards (developers, designers/PMs, marketers, support/docs)
  Privacy         "private by design" text + "good to know" list (http/https only, no audio, pointer shows)
  Contact         support email link
</main>
AppFooterForHomePage
```

Components live in `src/components/`, and each reads only `t()` keys. `StepCard` and `FeatureCard` are small presentational components (`FeatureCard` is reused for audiences).

Target market and messaging come from the Chrome Web Store listing (`sicorder_extension/docs/store-listing.md`): web developers and marketers who today record the whole screen and crop/trim manually. Icons are inline SVG.

## English source text

`public/locales/en/landing.json`:

```json
{
  "seo": {
    "title": "sicorder — Record just part of a web page as video",
    "description": "sicorder is a Chrome extension for web developers and marketers: pick an element, press Record, and get an MP4 of exactly that part of the page. No full-screen capture, no cropping, no trimming.",
    "keywords": [
      "sicorder",
      "Chrome extension",
      "record part of screen",
      "element recorder",
      "record web page section",
      "crop screen recording",
      "MP4",
      "product demo video",
      "bug report video"
    ]
  },
  "hero": {
    "title": "Record just the part of the web page you need",
    "subtitle": "Pick an element, press Record, and get an MP4 of exactly that element. No full-screen capture, no cropping, no trimming.",
    "cta": "Get sicorder for Chrome",
    "ctaSoon": "Coming soon to the Chrome Web Store",
    "note": "Free · Runs entirely in your browser"
  },
  "problem": {
    "title": "Stop recording your whole screen just to show one part of it",
    "text": "When you need a clip of one component, an animated chart, a form flow or a new feature, the usual routine is to record the full screen, crop it in a video editor, trim the dead time and export again. sicorder skips all of that: the video contains exactly the part you picked, and nothing else."
  },
  "howItWorks": {
    "title": "How it works",
    "steps": {
      "pick": {
        "title": "Pick a region",
        "text": "Click the sicorder icon, turn on Pick Region and click the element you want. It highlights as you hover, like the element picker in DevTools, and a dotted border marks your choice."
      },
      "record": {
        "title": "Record",
        "text": "Press Record and use the page as usual. Only the picked element ends up in the video."
      },
      "stop": {
        "title": "Stop",
        "text": "Press Stop. The MP4 lands in your Downloads folder."
      }
    }
  },
  "features": {
    "title": "Why it saves time",
    "items": {
      "exact": {
        "title": "Exactly the element, no cropping",
        "text": "The video matches the element's bounds pixel for pixel, at your display's full resolution."
      },
      "smart": {
        "title": "No dead time to trim",
        "text": "With Smart recording on, sicorder stops adding frames after half a second without any visual change and picks up again when something moves."
      },
      "pause": {
        "title": "Pauses when you look away",
        "text": "Scroll the element out of view or switch tabs and recording pauses, so the gap never shows up in the video."
      },
      "autoStop": {
        "title": "Stops on its own",
        "text": "If the element disappears or the page navigates away, sicorder stops, saves what it recorded and tells you why."
      },
      "names": {
        "title": "Files you can find later",
        "text": "Recordings are named after the site, the element and the date, like github_pull_request_2026_09_14.mp4."
      },
      "share": {
        "title": "Ready to share",
        "text": "MP4 (H.264) plays in Slack, docs, pull requests, email and every video player."
      }
    }
  },
  "audiences": {
    "title": "Built for",
    "items": {
      "developers": {
        "title": "Web developers",
        "text": "Attach a clip of a bug or a finished feature to a pull request or issue, without anything else on your screen in the frame."
      },
      "designers": {
        "title": "Designers and product managers",
        "text": "Capture a single component or interaction for a spec, a review or a changelog."
      },
      "marketers": {
        "title": "Marketers",
        "text": "Record clean product clips for landing pages, social posts and launch announcements, cropped to the part of the app that matters."
      },
      "support": {
        "title": "Support and documentation teams",
        "text": "Show one widget or one step without the rest of the interface."
      }
    }
  },
  "privacy": {
    "title": "Private by design",
    "text": "Recording and encoding happen entirely in your browser. sicorder doesn't upload your recordings, doesn't collect analytics and doesn't need an account. Videos go straight to your Downloads folder."
  },
  "goodToKnow": {
    "title": "Good to know",
    "items": {
      "pages": "Works on regular web pages (http and https). Chrome doesn't allow extensions to record its own pages, such as chrome:// settings or the Web Store.",
      "audio": "Records video only, no audio.",
      "pointer": "The mouse pointer appears in the recording when it's over the picked element."
    }
  },
  "contact": {
    "title": "Questions or feedback?",
    "subtitle": "We'd love to hear how you use sicorder."
  },
  "footer": {
    "product": "Product",
    "company": "Sudobility",
    "description": "sicorder records just the part of a web page you pick, as an MP4.",
    "chromeWebStore": "Chrome Web Store"
  },
  "breadcrumbHome": "Home"
}
```

`public/locales/en/howto.json`:

```json
{
  "home": {
    "name": "How to record part of a web page as video with sicorder",
    "description": "Record a single element of a web page to an MP4 using the sicorder Chrome extension.",
    "steps": [
      { "name": "Install sicorder", "text": "Add the sicorder extension to Chrome from the Chrome Web Store." },
      { "name": "Pick a region", "text": "Click the sicorder toolbar icon, turn on Pick Region, and click the element to record." },
      { "name": "Record", "text": "Press Record and interact with the page." },
      { "name": "Stop and save", "text": "Press Stop. The MP4 is saved to your Downloads folder." }
    ]
  }
}
```

## Localization rules

- Every user-facing string comes through `t()`. The only raw text is the brand name `sicorder` (via `CONSTANTS.APP_NAME`) and the support email address.
- The 14 other locale files are produced by `bun run localize`. It sends English strings to the Whisperly endpoint `https://api.whisperly.dev/api/v1/translate/jie9cytr/starter`, the same one sudobility uses.
- `bun run localized` (`scripts/localization_verify.cjs`) fails if any locale is missing a key from English.
- Adding a language follows the same six steps as in sudobility's CLAUDE.md.
- Layouts must survive longer strings (German, Russian) and CJK: no fixed-width text containers, and cards wrap.

## Error handling

- Missing `VITE_CHROME_STORE_URL`: disabled CTA with the `hero.ctaSoon` text.
- Missing Firebase env: analytics calls no-op (as in sudobility's `analyticsService`).
- Unsupported `/:lang`: redirect to `/en`.

## Verification

- `bun run build` (includes `tsc -b`, static processing, SEO generation), `bun run lint`, `bun run localized`.
- Visual check with screenshots at 1440 px and 390 px, for `/en` and `/de` (long strings) and `/ja` (CJK), after localize.
- Check `dist/` contains per-language `index.html` with localized `<title>`, `sitemap.xml`, and `robots.txt`.

## Project layout

```
sicorder_web/
  index.template.html  seo.config.mjs  vite.config.ts  tailwind.config.js  postcss.config.js
  tsconfig.json  eslint.config.js  wrangler.toml  package.json  .env.example  .gitignore
  CLAUDE.md  README.md  LICENSE.md
  public/  _redirects  logo.png  logo.svg  favicon*.png  favicon.ico  og-image.png
           robots.template.txt  sitemap.template.xml  llms.template.txt
           locales/{15 langs}/landing.json, howto.json
  scripts/localization_verify.cjs
  src/  main.tsx  App.tsx  i18n.ts  index.css  vite-env.d.ts
        config/ constants.ts  seo.ts  initialize.ts  analytics.ts
        components/ Hero.tsx  HowItWorks.tsx  Features.tsx  ContactSection.tsx  StepCard.tsx  FeatureCard.tsx
        stubs/ (6 files, as sudobility)
```

Icons and the OG image are generated from the extension's icon design (dark tile, dotted frame, red dot) with a small script.

## Out of scope

Prerender/snapshot middleware, blog/docs pages, pricing, sign-in, and screenshots/video of the extension (these can be added once store assets exist).
