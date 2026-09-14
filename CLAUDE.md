# CLAUDE.md — sicorder_web

Landing page for the sicorder Chrome extension (`~/projects/sicorder_extension`). One page, 15 locales, built on the sudobility shell. Deployed to Cloudflare Pages at sicorder.sudobility.com. Audience: web developers and marketers who today record the whole screen and crop/trim by hand.

## Tech Stack

- Bun, React 19, Vite 6, TypeScript (strict), Tailwind 3 + `@sudobility/design` preset
- `@sudobility/building_blocks` (SudobilityApp, AppTopBar, AppBreadcrumbs, AppFooterForHomePage), `@sudobility/components`, `@sudobility/seo_lib`, `@sudobility/di`
- i18next + http backend, `/:lang` routing

## Project Structure

```
src/App.tsx              shell, routes, footer links, SEO head
src/i18n.ts              supportedLanguages (canonical list of 15)
src/components/          Hero, ProblemSection, HowItWorks, Features, Audiences, PrivacySection, ContactSection, StepCard, FeatureCard
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
bun run localize     # translate missing strings via Whisperly (network; needs WHISPERLY_API_KEY), then prettier
bun run localized    # fail if any locale misses a key from en
bun run brand        # regenerate logo/favicons/og-image
bun run preview
```

No test framework: verify with build, lint, localized, and screenshots at 1440 and 390 px (include /de for long strings and /ja for CJK).

## Localization rules

1. Edit `public/locales/en/*.json` first; never hardcode user-facing text.
2. Run `bun run localize`, then `bun run localized`. The script only fills **missing** keys: to retranslate a changed English string, delete that key from the other locales first.
3. Keep `sicorder` untranslated, and review Whisperly output before committing. The first run (2026-09-14) broke the brand in ~40 strings: "Sicorder", "Sikorder", シカッター, the SEO keyword "sicorder" as "cycles", and "the sicorder icon" as "the picker/recorder icon". Short labels also lost their context: "Pick a region" came out as a geographic region, "Record" as audio recording (録音/녹음), "Stop" as a stop-sign command, and the footer title "Sudobility" as "usability". Check that every string containing `sicorder` in English still contains it in each locale. Keep brand names out of translation keys (the footer uses `CONSTANTS.COMPANY_NAME`).
4. Adding a language: `src/i18n.ts` (list + name), `LANGUAGE_FLAGS` in `App.tsx`, `seo.config.mjs`, `scripts/localization_verify.cjs`, and the localize script's own language list (in johnqh/workflows).
5. Page copy mirrors the Chrome Web Store listing (`sicorder_extension/docs/store-listing.md`); keep the two consistent.

## Gotchas

- **Stubs:** building_blocks imports optional packages this site doesn't install. If a build fails with "export not found" from a stubbed package, add the export to `src/stubs/`.
- **Shared scripts:** `process:static`, `seo:fetch` and `localize` download scripts from `johnqh/workflows` `main` at run time and execute them. The build needs network access, and a change on that branch changes this build. Downloads use `curl -f` into `node_modules/.cache/workflows/` so a failed fetch stops the build.
- **The SEO generator needs every locale file** (it reads `public/locales/<lang>/landing.json` for all 15), so `bun run build` fails until localization has run.
- **Generated files are committed** (as in sudobility): `index.html`, `public/robots.txt`, `public/sitemap*.xml`, `public/llms.txt`. Edit the templates or `seo.config.mjs`, not the outputs.
- **CTA:** `VITE_CHROME_STORE_URL` empty → disabled "Coming soon" text. Set it in Cloudflare Pages env when the extension is published.

## Related Projects

- `sicorder_extension` — the extension this page describes
- `sudobility` — reference implementation of this shell
