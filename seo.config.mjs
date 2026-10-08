/** SEO route config for generate-seo-assets-v2.mjs (johnqh/workflows). */
const APP_NAME = process.env.VITE_APP_NAME || 'sicorder';

export default {
  supportedLanguages: [
    'en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'fr', 'de',
    'it', 'pt', 'ru', 'sv', 'th', 'uk', 'vi',
  ],

  languageHreflangMap: {
    en: 'en',
    zh: 'zh-Hans',
    'zh-hant': 'zh-Hant',
    ja: 'ja',
    ko: 'ko',
    es: 'es',
    fr: 'fr',
    de: 'de',
    it: 'it',
    pt: 'pt',
    ru: 'ru',
    sv: 'sv',
    th: 'th',
    uk: 'uk',
    vi: 'vi',
  },

  primaryDomain: 'sicorder.sudobility.com',
  appName: APP_NAME,
  appDomain: process.env.VITE_APP_DOMAIN || 'sicorder.sudobility.com',
  // Canonical URLs have no trailing slash (matches seo_lib's runtime canonical).
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
    {
      key: 'docs',
      path: '/docs',
      namespace: 'landing',
      priority: '0.7',
      changefreq: 'monthly',
      indexable: true,
      meta: locale => ({
        title: `${locale.landing.nav.docs} | ${APP_NAME}`,
        description: locale.landing.hero.subtitle,
      }),
    },
  ],
};
