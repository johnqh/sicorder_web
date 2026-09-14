# sicorder_web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A one-page, 15-locale landing site for the sicorder Chrome extension, built on the sudobility shell and deployable to Cloudflare Pages.

**Architecture:** Copy sudobility's proven setup (SudobilityApp shell, stub aliases, i18next with `/:lang` routing, seo_lib, the `johnqh/workflows` static and SEO build scripts), strip it to one route, and replace the content with four sicorder sections that read only translation keys.

**Tech Stack:** Bun, React 19, Vite 6, TypeScript, Tailwind 3 + `@sudobility/design`, `@sudobility/building_blocks`, `@sudobility/components`, `@sudobility/seo_lib`, `@sudobility/di`, i18next, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-14-sicorder-web-design.md`

## Global Constraints

- Bun only (`bun install`, `bun run …`). Never npm/yarn/pnpm.
- License BUSL-1.1; `"private": true`.
- 15 locales exactly: `en, zh, zh-hant, ja, ko, es, fr, de, it, pt, ru, sv, th, uk, vi`.
- Every user-facing string goes through `t()`. The only literal text is the brand `sicorder` (`CONSTANTS.APP_NAME`) and the support email.
- English source files: `public/locales/en/landing.json`, `public/locales/en/howto.json`.
- Domain `sicorder.sudobility.com`; canonical URLs have no trailing slash (`trailingSlashUrls: false`).
- CTA reads `VITE_CHROME_STORE_URL`; when empty, show the disabled `hero.ctaSoon` text.
- Dark theme; accent color `#E8453C`.
- Excluded: prerender/snapshot pipeline (`scripts/prerender.mjs`, `functions/_middleware.js`, `public/html`).
- No unit test framework (same as sudobility). Verification is `bun run build`, `bun run lint`, `bun run localized`, and screenshots.
- Commit directly on `main`. Commit messages end with:
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` and
  `Claude-Session: https://claude.ai/code/session_01UxGzpBqJ2cni1DBniDnyHr`

## File Structure

```
sicorder_web/
  package.json  tsconfig.json  vite.config.ts  tailwind.config.js  postcss.config.js  eslint.config.js
  .prettierrc.json  .prettierignore  .gitignore  .env.example  wrangler.toml  LICENSE.md
  index.template.html            → index.html (process:static)
  seo.config.mjs
  scripts/make-brand-assets.ts   → public/logo.png, favicon-192/512.png, apple-touch-icon.png, favicon.ico, og-image.png
  scripts/localization_verify.cjs
  public/_redirects  public/logo.svg  public/llms.template.txt
  public/locales/{15}/landing.json, howto.json
  src/main.tsx  src/App.tsx  src/i18n.ts  src/index.css  src/vite-env.d.ts
  src/config/constants.ts  seo.ts  initialize.ts  analytics.ts
  src/components/Hero.tsx  HowItWorks.tsx  Features.tsx  ContactSection.tsx  StepCard.tsx  FeatureCard.tsx
  src/stubs/firebase-auth.ts  di_web.ts  auth_lib.ts  subscription-components.ts  devops-components.ts  subscription_lib.ts
  CLAUDE.md  README.md
```

---

### Task 1: Scaffold that builds with the sudobility shell

**Files:** Create everything under "config" and "stubs" above, plus `index.template.html`, `seo.config.mjs`, `public/_redirects`, `public/llms.template.txt`, a placeholder `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/vite-env.d.ts`, `src/config/*`, and minimal `public/locales/en/landing.json` + `howto.json` (full text in Task 3).

**Interfaces:**
- Produces: `CONSTANTS { APP_NAME, APP_DOMAIN, COMPANY_NAME, SUPPORT_EMAIL, CHROME_STORE_URL }`; `analyticsService.trackButtonClick(name, params?)`; `initializeApp()`; `seoHeadConfig`; Tailwind colors `record`, `dark.bg`, `dark.card`, `dark.border`; CSS classes `.glass`, `.gradient-text`.

- [ ] **Step 1: `package.json`**

```json
{
  "name": "sicorder_web",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "process:static": "curl -sL https://raw.githubusercontent.com/johnqh/workflows/main/scripts/process-static-files.ts -o /tmp/process-static-files.ts && bunx tsx /tmp/process-static-files.ts",
    "dev": "bun run process:static && vite",
    "seo:fetch": "curl -fsSL https://raw.githubusercontent.com/johnqh/workflows/main/scripts/generate-seo-assets-v2.mjs -o /tmp/generate-seo-assets.mjs",
    "build": "bun run process:static && bun run seo:fetch && node /tmp/generate-seo-assets.mjs public && tsc -b && vite build && node /tmp/generate-seo-assets.mjs dist",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "brand": "bun scripts/make-brand-assets.ts",
    "localize": "SCRIPT=$(mktemp) && curl -fsSL https://raw.githubusercontent.com/johnqh/workflows/main/scripts/localize_batch.cjs -o $SCRIPT && node $SCRIPT ./public/locales https://api.whisperly.dev/api/v1/translate/jie9cytr/starter --word-limit 40 && rm -f $SCRIPT && prettier public/locales --write",
    "localized": "node scripts/localization_verify.cjs",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json}\""
  },
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@sudobility/building_blocks": "^0.0.301",
    "@sudobility/components": "^5.3.17",
    "@sudobility/design": "^1.1.52",
    "@sudobility/di": "^1.5.65",
    "@sudobility/seo_lib": "^0.0.38",
    "@sudobility/types": "^1.9.67",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.8.0",
    "i18next": "^25.0.0",
    "i18next-browser-languagedetector": "^8.0.0",
    "i18next-http-backend": "^3.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-helmet-async": "^2.0.5",
    "react-i18next": "^16.0.0",
    "react-router-dom": "^7.0.0",
    "tailwind-merge": "^3.4.0",
    "web-vitals": "^5.1.0"
  },
  "overrides": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "devDependencies": {
    "@eslint/js": "^9.39.2",
    "@types/bun": "^1.3.14",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.39.2",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.26",
    "globals": "^17.0.0",
    "postcss": "^8.4.0",
    "prettier": "^3.6.2",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "typescript-eslint": "^8.53.0",
    "vite": "^6.0.0"
  },
  "license": "BUSL-1.1",
  "author": "Sudobility Inc.",
  "repository": { "type": "git", "url": "git+https://github.com/johnqh/sicorder_web.git" }
}
```

- [ ] **Step 2: Copy the unchanged configs from sudobility**

```bash
cp ../sudobility/postcss.config.js ../sudobility/eslint.config.js ../sudobility/.prettierrc.json ../sudobility/.prettierignore .
mkdir -p src/stubs scripts && cp ../sudobility/src/stubs/*.ts src/stubs/
cp ../sudobility/scripts/localization_verify.cjs scripts/
cp ../sudobility/src/vite-env.d.ts src/
sed -e 's/Licensed Work: raidr\./Licensed Work: sicorder_web./' -e 's/Change Date: 2030-08-25/Change Date: 2030-09-14/' ../raidr_extension/LICENSE.md > LICENSE.md
```

Then edit `eslint.config.js`'s ignore list to `{ ignores: ['dist', 'scripts', 'seo.config.mjs'] }`.

- [ ] **Step 3: `tsconfig.json`** — sudobility's, with `"types": ["bun"]` removed from app scope (scripts are excluded):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: `vite.config.ts`** (sudobility's without the di_web service-worker plugin)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-helmet-async', '@sudobility/components', '@sudobility/building_blocks'],
    alias: {
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react-helmet-async': resolve(__dirname, 'node_modules/react-helmet-async'),
      // Optional peer dependencies of @sudobility/building_blocks that this site doesn't use.
      'firebase/auth': resolve(__dirname, 'src/stubs/firebase-auth.ts'),
      '@sudobility/subscription-components': resolve(__dirname, 'src/stubs/subscription-components.ts'),
      '@sudobility/devops-components': resolve(__dirname, 'src/stubs/devops-components.ts'),
      '@sudobility/di_web': resolve(__dirname, 'src/stubs/di_web.ts'),
      '@sudobility/auth_lib': resolve(__dirname, 'src/stubs/auth_lib.ts'),
      '@sudobility/subscription_lib': resolve(__dirname, 'src/stubs/subscription_lib.ts'),
    },
  },
  optimizeDeps: { include: ['react', 'react-dom'] },
  server: { port: 4010 },
  build: { target: 'es2020', outDir: 'dist', cssCodeSplit: true, sourcemap: false, chunkSizeWarningLimit: 1100 },
});
```

- [ ] **Step 5: `tailwind.config.js`**

```js
import { createTailwindPreset } from '@sudobility/design';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [createTailwindPreset()],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sudobility/components/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/design/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/building_blocks/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        record: { DEFAULT: '#E8453C', soft: '#F28B82' },
        dark: { bg: '#0F172A', card: '#1E293B', border: '#334155' },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body { margin: 0; min-width: 320px; min-height: 100vh; }
#root { min-height: 100vh; display: flex; flex-direction: column; }

.font-small { font-size: 14px; }
.font-medium { font-size: 16px; }
.font-large { font-size: 18px; }

.glass {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.gradient-text {
  background: linear-gradient(135deg, #f28b82 0%, #e8453c 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Long translations (de, ru) and CJK wrap instead of overflowing. */
h1, h2, h3, p { overflow-wrap: anywhere; }
```

- [ ] **Step 7: `src/config/constants.ts`, `analytics.ts`, `seo.ts`, `initialize.ts`**

`src/config/constants.ts`:
```ts
export const CONSTANTS = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'sicorder',
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || 'sicorder.sudobility.com',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'Sudobility',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'info@sudobility.com',
  CHROME_STORE_URL: import.meta.env.VITE_CHROME_STORE_URL || '',
} as const;
```

`src/config/analytics.ts`:
```ts
import { getFirebaseService } from '@sudobility/di';

export type AnalyticsEventParams = Record<string, unknown>;

/** No-ops when Firebase isn't configured. */
export const analyticsService = {
  trackEvent(eventName: string, params?: AnalyticsEventParams): void {
    try {
      const service = getFirebaseService();
      if (service.analytics.isSupported()) {
        service.analytics.logEvent(eventName, { ...params, timestamp: Date.now() });
      }
    } catch {
      // Firebase service not initialized
    }
  },
  trackButtonClick(buttonName: string, params?: AnalyticsEventParams): void {
    this.trackEvent('button_click', { button_name: buttonName, ...params });
  },
};
```

`src/config/seo.ts`:
```ts
import { type SEOHeadConfig } from '@sudobility/seo_lib';
import { CONSTANTS } from './constants';
import { supportedLanguages } from '../i18n';

export const seoHeadConfig: SEOHeadConfig = {
  appName: CONSTANTS.APP_NAME,
  baseUrl: `https://${CONSTANTS.APP_DOMAIN}`,
  defaultOgImage: `https://${CONSTANTS.APP_DOMAIN}/og-image.png`,
  twitterHandle: undefined,
  supportedLanguages: supportedLanguages as unknown as string[],
  defaultLanguage: 'en',
  applicationCategory: 'MultimediaApplication',
};
```

`src/config/initialize.ts`:
```ts
import { initializeFirebaseService, initializeNetworkService, initializeStorageService } from '@sudobility/di';
import { initWebVitals } from '@sudobility/components';

/** Call once before rendering. Firebase (analytics only) starts only when configured. */
export function initializeApp(): void {
  initializeStorageService();
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    initializeFirebaseService({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    });
  }
  initializeNetworkService();
  initWebVitals();
}
```

- [ ] **Step 8: `src/i18n.ts`** — sudobility's file verbatim (15 languages, `ns: ['landing', 'howto']`, `defaultNS: 'landing'`, path detection, `/locales/{{lng}}/{{ns}}.json`):

```bash
cp ../sudobility/src/i18n.ts src/i18n.ts
```

- [ ] **Step 9: `src/main.tsx`** and placeholder `src/App.tsx`

`src/main.tsx`:
```tsx
import { setFirebaseProxy } from '@sudobility/di';
setFirebaseProxy(import.meta.env.VITE_FIREBASE_PROXY);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureTheme } from '@sudobility/design';
import { defaultTheme, generateThemeCSS } from '@sudobility/design/themes';
import { initializeApp } from './config/initialize';
import './index.css';
import App from './App';

configureTheme(defaultTheme);
const styleEl = document.createElement('style');
styleEl.id = 'sudobility-design-theme';
styleEl.textContent = generateThemeCSS(defaultTheme);
document.head.appendChild(styleEl);

initializeApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.tsx` (placeholder, replaced in Task 3):
```tsx
export default function App() {
  return <div className="min-h-screen bg-dark-bg text-white">sicorder</div>;
}
```

- [ ] **Step 10: `index.template.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <title>{{VITE_APP_NAME}} — Record any part of a web page as video</title>
    <meta name="description" content="{{VITE_APP_NAME}} is a Chrome extension that records video of a single element on any web page and saves it as an MP4." />
    <meta name="author" content="{{VITE_COMPANY_NAME}}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="application-name" content="{{VITE_APP_NAME}}" />
    <meta name="theme-color" content="#0F172A" />

    <!-- og:url, canonical and hreflang are per-route: written by the SEO generator. -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{{VITE_APP_NAME}} — Record any part of a web page as video" />
    <meta property="og:description" content="A Chrome extension that records video of a single element on any web page." />
    <meta property="og:image" content="https://{{VITE_APP_DOMAIN}}/og-image.png" />
    <meta property="og:site_name" content="{{VITE_APP_NAME}}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://{{VITE_APP_DOMAIN}}/og-image.png" />

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "{{VITE_APP_NAME}}",
        "url": "https://{{VITE_APP_DOMAIN}}",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Chrome",
        "dateModified": "{{TODAY}}",
        "isAccessibleForFree": true,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": { "@type": "Organization", "name": "{{VITE_COMPANY_NAME}}", "email": "{{VITE_SUPPORT_EMAIL}}" }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 11: `seo.config.mjs`**

```js
/** SEO route config for generate-seo-assets-v2.mjs (johnqh/workflows). */
const APP_NAME = process.env.VITE_APP_NAME || 'sicorder';

export default {
  supportedLanguages: ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'sv', 'th', 'uk', 'vi'],
  languageHreflangMap: {
    en: 'en', zh: 'zh-Hans', 'zh-hant': 'zh-Hant', ja: 'ja', ko: 'ko', es: 'es', fr: 'fr', de: 'de',
    it: 'it', pt: 'pt', ru: 'ru', sv: 'sv', th: 'th', uk: 'uk', vi: 'vi',
  },
  primaryDomain: 'sicorder.sudobility.com',
  appName: APP_NAME,
  appDomain: process.env.VITE_APP_DOMAIN || 'sicorder.sudobility.com',
  trailingSlashUrls: false,
  routes: [
    {
      key: 'home',
      path: '',
      namespace: 'landing',
      priority: '1.0',
      changefreq: 'weekly',
      indexable: true,
      meta: locale => ({
        title: locale.landing.seo.title,
        description: locale.landing.seo.description,
        keywords: locale.landing.seo.keywords,
      }),
    },
  ],
};
```

- [ ] **Step 12: `public/_redirects`, `public/llms.template.txt`, `wrangler.toml`, `.env.example`, `.gitignore`**

`public/_redirects`:
```
# Canonical language entry point (no trailing slash)
/ /en 308

# SPA fallback
/* /index.html 200
```

`public/llms.template.txt`:
```
# {{VITE_APP_NAME}}

> A Chrome extension that records video of a single element on any web page.

## Overview
{{VITE_APP_NAME}} records just the element you pick (a chart, a form, a component) and saves it as an MP4 to your Downloads. It pauses while the element is out of view or the tab is in the background, can skip stretches with no visual change, and stops on its own if the element disappears. Everything runs in the browser; nothing is uploaded.

## Key Pages
- `/:lang` - Localized homepage (en, de, es, fr, it, ja, ko, pt, ru, sv, th, uk, vi, zh, zh-hant)

## Contact
{{VITE_SUPPORT_EMAIL}}
```

`wrangler.toml`:
```toml
name = "sicorder-web"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./dist"
```

`.env.example` (and copy to `.env`, which is gitignored):
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
VITE_FIREBASE_PROXY=
```

`.gitignore`:
```
node_modules/
dist/
*.tsbuildinfo
.env
.env.local
.env.*.local
.DS_Store
*.log
```

- [ ] **Step 13: Minimal locale files so the SEO generator runs**

`public/locales/en/landing.json`:
```json
{ "seo": { "title": "sicorder", "description": "sicorder", "keywords": ["sicorder"] } }
```
`public/locales/en/howto.json`:
```json
{ "home": { "name": "sicorder", "description": "sicorder", "steps": [] } }
```

- [ ] **Step 14: Install and build**

```bash
cp .env.example .env
bun install
bun run build
```
Expected: build succeeds. `dist/en/index.html`, `dist/sitemap.xml` and `dist/robots.txt` exist, as do `index.html`, `public/llms.txt`, `public/sitemap*.xml` and `public/robots.txt`. If the build reports a missing stub export, add that export to the matching `src/stubs/*.ts`.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "chore: scaffold sicorder_web on the sudobility shell"
```

---

### Task 2: Brand assets

**Files:**
- Create: `scripts/make-brand-assets.ts`, `public/logo.svg`
- Generated: `public/logo.png` (512), `public/favicon-192.png`, `public/favicon-512.png`, `public/apple-touch-icon.png` (180), `public/favicon.ico` (32 px PNG inside ICO), `public/og-image.png` (1200×630)

- [ ] **Step 1: `public/logo.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="26" fill="#202124"/>
  <rect x="21" y="21" width="86" height="86" fill="none" stroke="#F0F0F0" stroke-width="7" stroke-dasharray="7 6"/>
  <circle cx="64" cy="64" r="22" fill="#E8453C"/>
</svg>
```

- [ ] **Step 2: `scripts/make-brand-assets.ts`**

```ts
// Generates the site's PNG/ICO brand assets from the sicorder icon design
// (dark rounded tile, dotted frame, red record dot). No dependencies.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

type RGBA = [number, number, number, number];

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(width: number, height: number, rgba: Uint8Array): Buffer {
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * stride + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', new Uint8Array()),
  ]);
}

/** Icon shape in unit coordinates; transparent outside the rounded tile. */
function icon(u: number, v: number): RGBA {
  const radius = 0.2;
  const qx = Math.max(Math.abs(u - 0.5) - (0.5 - radius), 0);
  const qy = Math.max(Math.abs(v - 0.5) - (0.5 - radius), 0);
  if (qx * qx + qy * qy > radius * radius) return [0, 0, 0, 0];
  if (Math.hypot(u - 0.5, v - 0.5) < 0.17) return [232, 69, 60, 255];
  const ring = Math.max(Math.abs(u - 0.5), Math.abs(v - 0.5));
  if (ring > 0.3 && ring < 0.36) {
    const along = Math.abs(u - 0.5) > Math.abs(v - 0.5) ? v : u;
    if (Math.floor(along * 10) % 2 === 0) return [240, 240, 240, 255];
  }
  return [32, 33, 36, 255];
}

/** Supersampled render of `shade(x, y)` in pixel coordinates. */
function render(width: number, height: number, shade: (x: number, y: number) => RGBA): Uint8Array {
  const ss = 4;
  const out = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const acc = [0, 0, 0, 0];
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const px = shade(x + (sx + 0.5) / ss, y + (sy + 0.5) / ss);
          for (let i = 0; i < 4; i++) acc[i]! += px[i]!;
        }
      }
      for (let i = 0; i < 4; i++) out[(y * width + x) * 4 + i] = Math.round(acc[i]! / (ss * ss));
    }
  }
  return out;
}

const square = (size: number) => encodePng(size, size, render(size, size, (x, y) => icon(x / size, y / size)));

function ico(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header[6] = size; // width
  header[7] = size; // height
  header.writeUInt16LE(1, 10); // color planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // data offset
  return Buffer.concat([header, png]);
}

function ogImage(): Buffer {
  const width = 1200;
  const height = 630;
  const iconSize = 320;
  const left = (width - iconSize) / 2;
  const top = (height - iconSize) / 2;
  const background: RGBA = [15, 23, 42, 255];
  return encodePng(
    width,
    height,
    render(width, height, (x, y) => {
      const u = (x - left) / iconSize;
      const v = (y - top) / iconSize;
      if (u < 0 || u > 1 || v < 0 || v > 1) return background;
      const px = icon(u, v);
      return px[3] === 0 ? background : px;
    }),
  );
}

writeFileSync('public/logo.png', square(512));
writeFileSync('public/favicon-512.png', square(512));
writeFileSync('public/favicon-192.png', square(192));
writeFileSync('public/apple-touch-icon.png', square(180));
writeFileSync('public/favicon.ico', ico(square(32), 32));
writeFileSync('public/og-image.png', ogImage());
console.log('brand assets written to public/');
```

- [ ] **Step 3: Generate and check**

```bash
bun run brand
```
Expected: "brand assets written to public/". View `public/logo.png` and `public/og-image.png`: a dark tile with a dotted frame and a red dot (og image centered on navy).

- [ ] **Step 4: Commit**

```bash
git add scripts/make-brand-assets.ts public/logo.svg public/*.png public/favicon.ico
git commit -m "feat: sicorder brand assets (logo, favicons, og image)"
```

---

### Task 3: English source text and the app shell

**Files:**
- Modify: `public/locales/en/landing.json`, `public/locales/en/howto.json` (full text)
- Replace: `src/App.tsx`

**Interfaces:**
- Consumes: `CONSTANTS`, `seoHeadConfig`, `supportedLanguages`, `languageNames`, `SupportedLanguage` from `src/i18n.ts`.
- Produces: translation keys used by Task 4: `hero.{title,subtitle,cta,ctaSoon,note}`, `howItWorks.title`, `howItWorks.steps.{pick,record,stop}.{title,text}`, `features.title`, `features.items.{exact,pause,smart,autoStop,names,private}.{title,text}`, `contact.{title,subtitle}`, `footer.{product,company,description,chromeWebStore,contact}`, `breadcrumbHome`.

- [ ] **Step 1: `public/locales/en/landing.json`** — spec text plus two footer link labels:

```json
{
  "seo": {
    "title": "sicorder — Record any part of a web page as video",
    "description": "sicorder is a Chrome extension that records video of a single element on any web page. Pick a region, press Record, and get an MP4 saved to your Downloads.",
    "keywords": ["sicorder", "Chrome extension", "screen recorder", "element recorder", "record web page", "MP4", "tab capture", "UI demo video"]
  },
  "hero": {
    "title": "Record any part of a web page as video",
    "subtitle": "sicorder is a Chrome extension that records just the element you pick — a chart, a form, a component — and saves it as an MP4.",
    "cta": "Get sicorder for Chrome",
    "ctaSoon": "Coming soon to the Chrome Web Store",
    "note": "Free · Runs entirely in your browser"
  },
  "howItWorks": {
    "title": "How it works",
    "steps": {
      "pick": { "title": "Pick a region", "text": "Open the sicorder side panel, turn on Pick Region, and click the element you want. A dotted border marks it." },
      "record": { "title": "Record", "text": "Press Record and use the page as usual. Only the picked element ends up in the video." },
      "stop": { "title": "Stop", "text": "Press Stop. The MP4 is saved to your Downloads with a name based on the site and the element." }
    }
  },
  "features": {
    "title": "Built for clean clips",
    "items": {
      "exact": { "title": "Exactly the element", "text": "No cropping afterwards. The video matches the element's bounds, pixel for pixel." },
      "pause": { "title": "Pauses when out of view", "text": "Scroll the element away or switch tabs and recording pauses, so the gap never appears in the video." },
      "smart": { "title": "Smart recording", "text": "Skips stretches where nothing changes, so a forgotten recording wastes at most half a second." },
      "autoStop": { "title": "Stops on its own", "text": "If the element disappears or the page navigates, sicorder stops, saves what it has, and tells you why." },
      "names": { "title": "Meaningful file names", "text": "Files are named after the site, the element and the date, like amazon_cart_2026_09_14.mp4." },
      "private": { "title": "Stays on your computer", "text": "Recording and encoding happen in your browser. Nothing is uploaded." }
    }
  },
  "contact": {
    "title": "Questions or feedback?",
    "subtitle": "We'd love to hear how you use sicorder."
  },
  "footer": {
    "product": "Product",
    "company": "Sudobility",
    "description": "sicorder records video of a single element on any web page.",
    "chromeWebStore": "Chrome Web Store",
    "contact": "Contact"
  },
  "breadcrumbHome": "Home"
}
```

- [ ] **Step 2: `public/locales/en/howto.json`** — exactly the spec's JSON.

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

- [ ] **Step 3: Replace `src/App.tsx`** (sections are imported from Task 4, so create empty default-export stubs for them in this step: `export default function Hero() { return null; }` etc. for `Hero`, `HowItWorks`, `Features`, `ContactSection`)

```tsx
import { Suspense, useEffect, useMemo, type ReactNode } from 'react';
import { Link, Navigate, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBreadcrumbs, AppFooterForHomePage, AppTopBar, SudobilityApp } from '@sudobility/building_blocks';
import { FontSize, LayoutProvider, Theme, ThemeProvider } from '@sudobility/components';
import { buildHowToSchema, SEOHead, SEOHeadProvider } from '@sudobility/seo_lib';
import i18n, { languageNames, supportedLanguages, type SupportedLanguage } from './i18n';
import { CONSTANTS } from './config/constants';
import { seoHeadConfig } from './config/seo';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import ContactSection from './components/ContactSection';

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇺🇸', zh: '🇨🇳', 'zh-hant': '🇹🇼', ja: '🇯🇵', ko: '🇰🇷', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪',
  it: '🇮🇹', pt: '🇧🇷', ru: '🇷🇺', sv: '🇸🇪', th: '🇹🇭', uk: '🇺🇦', vi: '🇻🇳',
};

const isSupported = (lang: string | undefined): lang is SupportedLanguage =>
  !!lang && (supportedLanguages as readonly string[]).includes(lang);

const LinkWrapper = ({ href, children, className }: { href: string; children: ReactNode; className?: string }) =>
  href.startsWith('/') ? (
    <Link to={href} className={className}>{children}</Link>
  ) : (
    <a href={href} className={className} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
      {children}
    </a>
  );

const DarkThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    themeStorageKey="sicorder-theme"
    fontSizeStorageKey="sicorder-font-size"
    defaultTheme={Theme.DARK}
    defaultFontSize={FontSize.MEDIUM}
  >
    {children}
  </ThemeProvider>
);

function LoadingFallback() {
  return <div className="min-h-screen bg-dark-bg" />;
}

function Layout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n: i18nInstance, t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSupported(lang)) {
      if (i18nInstance.language !== lang) void i18nInstance.changeLanguage(lang);
    } else {
      navigate('/en', { replace: true });
    }
  }, [lang, i18nInstance, navigate]);

  const currentLang: SupportedLanguage = isSupported(lang) ? lang : 'en';

  const languages = useMemo(
    () => supportedLanguages.map(code => ({ code, name: languageNames[code], flag: LANGUAGE_FLAGS[code] })),
    []
  );

  const productLinks = [{ label: CONSTANTS.APP_NAME, href: `/${currentLang}` }];
  if (CONSTANTS.CHROME_STORE_URL) productLinks.push({ label: t('footer.chromeWebStore'), href: CONSTANTS.CHROME_STORE_URL });

  const footerLinkSections = [
    { title: t('footer.product'), links: productLinks },
    {
      title: t('footer.company'),
      links: [
        { label: 'sudobility.com', href: `https://sudobility.com/${currentLang}` },
        { label: CONSTANTS.SUPPORT_EMAIL, href: `mailto:${CONSTANTS.SUPPORT_EMAIL}` },
      ],
    },
  ];

  return (
    <LayoutProvider mode="full">
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <div className="sticky top-0 z-40">
          <AppTopBar
            logo={{ src: '/logo.png', appName: CONSTANTS.APP_NAME, onClick: () => navigate(`/${currentLang}`) }}
            menuItems={[]}
            languages={languages}
            currentLanguage={currentLang}
            onLanguageChange={(newLang: string) => {
              if (isSupported(newLang)) navigate(`/${newLang}`);
            }}
            LinkComponent={LinkWrapper}
          />
          <AppBreadcrumbs
            items={[{ label: t('breadcrumbHome'), href: `/${currentLang}`, current: true }]}
            shareConfig={{
              title: `${CONSTANTS.APP_NAME} — ${t('hero.title')}`,
              description: t('footer.description'),
              hashtags: [CONSTANTS.APP_NAME, 'ChromeExtension', 'ScreenRecording'],
            }}
          />
        </div>
        <main id="main-content" className="flex-1 bg-dark-bg text-white">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <AppFooterForHomePage
          logo={{ appName: CONSTANTS.APP_NAME }}
          linkSections={footerLinkSections}
          copyrightYear={String(new Date().getFullYear())}
          companyName={CONSTANTS.COMPANY_NAME}
          description={t('footer.description')}
          isNetworkOnline={true}
          LinkComponent={LinkWrapper}
        />
      </div>
    </LayoutProvider>
  );
}

function LandingPage() {
  const { t } = useTranslation('landing');
  const { t: tHowTo } = useTranslation('howto');

  const rawKeywords = t('seo.keywords', { returnObjects: true });
  const rawSteps = tHowTo('home.steps', { returnObjects: true });
  const howToSchema = Array.isArray(rawSteps)
    ? buildHowToSchema(tHowTo('home.name'), tHowTo('home.description'), rawSteps as { name: string; text: string }[])
    : undefined;

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={Array.isArray(rawKeywords) ? rawKeywords : undefined}
        structuredData={howToSchema}
      />
      <Hero />
      <HowItWorks />
      <Features />
      <ContactSection />
    </>
  );
}

function AppRoutes() {
  const { i18n: i18nInstance } = useTranslation();
  const initial = isSupported(i18nInstance.language) ? i18nInstance.language : 'en';
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route path="/" element={<Navigate to={`/${initial}`} replace />} />
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <SudobilityApp i18n={i18n} storageKeyPrefix="sicorder" ThemeProvider={DarkThemeProvider}>
      <SEOHeadProvider config={seoHeadConfig}>
        <AppRoutes />
      </SEOHeadProvider>
    </SudobilityApp>
  );
}
```

- [ ] **Step 4: Build and lint**

Run: `bun run build && bun run lint`
Expected: both succeed. If the TypeScript prop types of `AppTopBar`, `AppBreadcrumbs`, `AppFooterForHomePage` or `SEOHead` differ from sudobility's usage, match the types that `node_modules/@sudobility/*/dist/*.d.ts` declares.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: app shell with language routing, SEO and English source text"
```

---

### Task 4: Page sections

**Files:**
- Create/replace: `src/components/StepCard.tsx`, `FeatureCard.tsx`, `Hero.tsx`, `HowItWorks.tsx`, `Features.tsx`, `ContactSection.tsx`

**Interfaces:**
- Consumes: translation keys from Task 3; `CONSTANTS.CHROME_STORE_URL`, `CONSTANTS.SUPPORT_EMAIL`; `analyticsService.trackButtonClick`.

- [ ] **Step 1: `src/components/StepCard.tsx`**

```tsx
interface StepCardProps {
  number: number;
  title: string;
  text: string;
}

export default function StepCard({ number, title, text }: StepCardProps) {
  return (
    <li className="glass rounded-2xl p-6 sm:p-8 list-none">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-record text-white font-semibold mb-5">
        {number}
      </span>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{text}</p>
    </li>
  );
}
```

- [ ] **Step 2: `src/components/FeatureCard.tsx`**

```tsx
import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export default function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <div className="glass rounded-2xl p-6 h-full">
      <div className="h-10 w-10 rounded-lg bg-record/15 text-record-soft flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{text}</p>
    </div>
  );
}
```

- [ ] **Step 3: `src/components/Hero.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import { CONSTANTS } from '../config/constants';
import { analyticsService } from '../config/analytics';

export default function Hero() {
  const { t } = useTranslation();
  const storeUrl = CONSTANTS.CHROME_STORE_URL;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,69,60,0.22),transparent_60%)]"
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <img src="/logo.png" alt="" width={96} height={96} className="mx-auto mb-8 h-20 w-20 sm:h-24 sm:w-24" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="gradient-text">{t('hero.title')}</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">{t('hero.subtitle')}</p>
        {storeUrl ? (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsService.trackButtonClick('get_extension')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-record px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-record/30 hover:bg-record/90 transition-colors"
          >
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-white" />
            {t('hero.cta')}
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-8 py-4 text-lg font-semibold text-white/60 cursor-not-allowed"
          >
            {t('hero.ctaSoon')}
          </span>
        )}
        <p className="mt-4 text-sm text-white/50">{t('hero.note')}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `src/components/HowItWorks.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import StepCard from './StepCard';

const STEPS = ['pick', 'record', 'stop'] as const;

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">{t('howItWorks.title')}</h2>
        <ol className="grid gap-6 md:grid-cols-3 p-0 m-0">
          {STEPS.map((key, index) => (
            <StepCard
              key={key}
              number={index + 1}
              title={t(`howItWorks.steps.${key}.title`)}
              text={t(`howItWorks.steps.${key}.text`)}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: `src/components/Features.tsx`**

```tsx
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import FeatureCard from './FeatureCard';

const svg = (d: string): ReactNode => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const FEATURES: { key: string; icon: ReactNode }[] = [
  { key: 'exact', icon: svg('M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4') },
  { key: 'pause', icon: svg('M10 9v6m4-6v6M12 21a9 9 0 100-18 9 9 0 000 18z') },
  { key: 'smart', icon: svg('M13 10V3L4 14h7v7l9-11h-7z') },
  { key: 'autoStop', icon: svg('M9 10h6v4H9zM12 21a9 9 0 100-18 9 9 0 000 18z') },
  { key: 'names', icon: svg('M7 7h.01M7 3h5l8 8-9 9-8-8V7a4 4 0 014-4z') },
  { key: 'private', icon: svg('M12 11c1.1 0 2-.9 2-2V7a2 2 0 10-4 0v2c0 1.1.9 2 2 2zm-6 0h12v10H6V11z') },
];

export default function Features() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">{t('features.title')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`features.items.${key}.title`)}
              text={t(`features.items.${key}.text`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `src/components/ContactSection.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import { CONSTANTS } from '../config/constants';

export default function ContactSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-24 h-1 bg-record mx-auto mb-10 rounded-full" />
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('contact.title')}</h2>
        <p className="text-white/60 mb-8 text-lg">{t('contact.subtitle')}</p>
        <a
          href={`mailto:${CONSTANTS.SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-3 px-6 py-3 glass rounded-xl hover:bg-white/10 transition-colors"
        >
          <svg className="h-5 w-5 text-record-soft" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-lg text-white break-all">{CONSTANTS.SUPPORT_EMAIL}</span>
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Build, lint, look**

```bash
bun run build && bun run lint
bun run preview --port 4011
```
Take screenshots of `http://localhost:4011/en` at 1440×900 and 390×844 (Playwright from a sibling project, headless). Expected: hero with logo, the gradient title and the disabled "Coming soon" CTA; three numbered step cards; six feature cards; contact email; the sudobility top bar with a language picker and the footer. No horizontal scroll at 390 px.

- [ ] **Step 8: Commit**

```bash
git add src/components
git commit -m "feat: hero, how it works, features and contact sections"
```

---

### Task 5: Localize, verify, docs

**Files:**
- Generated: `public/locales/{de,es,fr,it,ja,ko,pt,ru,sv,th,uk,vi,zh,zh-hant}/{landing,howto}.json`
- Create: `CLAUDE.md`, `README.md`

- [ ] **Step 1: Translate** (sends English strings to the Whisperly endpoint)

Run: `bun run localize`
Expected: the script reports translated strings for 14 languages and writes 28 files.

- [ ] **Step 2: Verify keys**

Run: `bun run localized`
Expected: every language reports "All keys present" for `landing.json` and `howto.json`, and the script exits 0. Spot-check that `ja/landing.json` `hero.title` is Japanese and `sicorder` stays untranslated. If Whisperly translated the brand name, restore `sicorder` in that string.

- [ ] **Step 3: Rebuild, then check localized output**

```bash
bun run build
grep -o '<title>[^<]*' dist/de/index.html dist/ja/index.html
```
Expected: localized titles. Take screenshots of `/de` and `/ja` at 1440 px and 390 px. Expected: long German strings wrap within cards, Japanese renders, no overflow.

- [ ] **Step 4: `CLAUDE.md`**

```markdown
# CLAUDE.md — sicorder_web

Landing page for the sicorder Chrome extension (`~/projects/sicorder_extension`). One page, 15 locales, built on the sudobility shell. Deployed to Cloudflare Pages at sicorder.sudobility.com.

## Tech Stack

- Bun, React 19, Vite 6, TypeScript (strict), Tailwind 3 + `@sudobility/design` preset
- `@sudobility/building_blocks` (SudobilityApp, AppTopBar, AppBreadcrumbs, AppFooterForHomePage), `@sudobility/components`, `@sudobility/seo_lib`, `@sudobility/di`
- i18next + http backend, `/:lang` routing

## Project Structure

```
src/App.tsx              shell, routes, footer links, SEO head
src/i18n.ts              supportedLanguages (canonical list of 15)
src/components/          Hero, HowItWorks, Features, ContactSection, StepCard, FeatureCard
src/config/              constants (VITE_* env), seo, initialize (Firebase only when configured), analytics
src/stubs/               no-op modules for building_blocks' optional peers (aliased in vite.config.ts)
public/locales/{lang}/   landing.json, howto.json (en is the source)
scripts/                 make-brand-assets.ts, localization_verify.cjs
index.template.html      → index.html via process:static
seo.config.mjs           route config for the SEO generator
```

## Commands

```bash
bun run dev          # process:static + vite on :4010
bun run build        # process:static, SEO assets (public + dist), tsc -b, vite build
bun run lint
bun run localize     # translate missing strings via Whisperly (network), then prettier
bun run localized    # fail if any locale misses a key from en
bun run brand        # regenerate logo/favicons/og-image
bun run preview
```

No test framework: verify with build, lint, localized, and screenshots at 1440 and 390 px (include /de for long strings and /ja for CJK).

## Localization rules

1. Edit `public/locales/en/*.json` first; never hardcode user-facing text.
2. Run `bun run localize`, then `bun run localized`.
3. Keep `sicorder` untranslated.
4. Adding a language: `src/i18n.ts` (list + name), `LANGUAGE_FLAGS` in `App.tsx`, `seo.config.mjs`, `scripts/localization_verify.cjs`, and the localize script's own language list (in johnqh/workflows).

## Gotchas

- **Stubs:** building_blocks imports optional packages this site doesn't install. If a build fails with "export not found" from a stubbed package, add the export to `src/stubs/`.
- **Shared scripts:** `process:static`, `seo:fetch` and `localize` download scripts from `johnqh/workflows` at run time, so the build needs network access.
- **Generated files are committed** (as in sudobility): `index.html`, `public/robots.txt`, `public/sitemap*.xml`, `public/llms.txt`. Edit the templates or `seo.config.mjs`, not the outputs.
- **CTA:** `VITE_CHROME_STORE_URL` empty → disabled "Coming soon" text. Set it in Cloudflare Pages env when the extension is published.

## Related Projects

- `sicorder_extension` — the extension this page describes
- `sudobility` — reference implementation of this shell
```

- [ ] **Step 5: `README.md`**

```markdown
# sicorder_web

Landing page for sicorder, a Chrome extension that records video of a single element on any web page.

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
```

- [ ] **Step 6: Final check and commit**

```bash
bun run build && bun run lint && bun run localized
git add -A
git commit -m "feat: localize into 14 languages; docs"
```
