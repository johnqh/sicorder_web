import { Suspense, useEffect, useMemo, type ReactNode } from 'react';
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBreadcrumbs,
  AppFooterForHomePage,
  AppTopBar,
  SudobilityApp,
} from '@sudobility/building_blocks';
import { FontSize, LayoutProvider, Theme, ThemeProvider } from '@sudobility/components';
import { buildHowToSchema, SEOHead, SEOHeadProvider } from '@sudobility/seo_lib';
import i18n, { languageNames, supportedLanguages, type SupportedLanguage } from './i18n';
import { CONSTANTS } from './config/constants';
import { seoHeadConfig } from './config/seo';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Audiences from './components/Audiences';
import PrivacySection from './components/PrivacySection';
import ContactSection from './components/ContactSection';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import SupportPage from './components/SupportPage';
import DocsPage, { DOC_TOPICS } from './components/DocsPage';

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  'zh-hant': '🇹🇼',
  ja: '🇯🇵',
  ko: '🇰🇷',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇧🇷',
  ru: '🇷🇺',
  sv: '🇸🇪',
  th: '🇹🇭',
  uk: '🇺🇦',
  vi: '🇻🇳',
};

const isSupported = (lang: string | undefined): lang is SupportedLanguage =>
  !!lang && (supportedLanguages as readonly string[]).includes(lang);

const LinkWrapper = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) =>
  href.startsWith('/') ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a
      href={href}
      className={className}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
    >
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
  const location = useLocation();
  const { i18n: i18nInstance, t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSupported(lang)) {
      if (i18nInstance.language !== lang) void i18nInstance.changeLanguage(lang);
    } else if (lang !== undefined) {
      navigate('/en', { replace: true });
    }
  }, [lang, i18nInstance, navigate]);

  const currentLang: SupportedLanguage = isSupported(lang) ? lang : 'en';

  const languages = useMemo(
    () =>
      supportedLanguages.map(code => ({
        code,
        name: languageNames[code],
        flag: LANGUAGE_FLAGS[code],
      })),
    []
  );

  const productLinks = [{ label: CONSTANTS.APP_NAME, href: `/${currentLang}` }];
  productLinks.push({ label: t('nav.docs'), href: `/${currentLang}/docs` });
  if (CONSTANTS.CHROME_STORE_URL) {
    productLinks.push({ label: t('footer.chromeWebStore'), href: CONSTANTS.CHROME_STORE_URL });
  }

  const footerLinkSections = [
    { title: t('footer.product'), links: productLinks },
    {
      title: CONSTANTS.COMPANY_NAME,
      links: [
        { label: 'sudobility.com', href: `https://sudobility.com/${currentLang}` },
        { label: CONSTANTS.SUPPORT_EMAIL, href: `mailto:${CONSTANTS.SUPPORT_EMAIL}` },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Support', href: '/support' },
      ],
    },
  ];

  const isDocs =
    location.pathname === `/${currentLang}/docs` ||
    location.pathname.startsWith(`/${currentLang}/docs/`);
  const docsTopic = isDocs
    ? DOC_TOPICS.find(item => item.slug === location.pathname.split('/')[3])
    : undefined;
  const breadcrumbItems = isDocs
    ? [
        { label: t('breadcrumbHome'), href: `/${currentLang}` },
        { label: t('nav.docs'), href: `/${currentLang}/docs`, current: !docsTopic },
        ...(docsTopic ? [{ label: docsTopic.title, href: location.pathname, current: true }] : []),
      ]
    : location.pathname.endsWith('/privacy') || location.pathname.endsWith('/support')
      ? [
          { label: t('breadcrumbHome'), href: `/${currentLang}` },
          {
            label: location.pathname.endsWith('/privacy') ? 'Privacy Policy' : 'Support',
            href: location.pathname,
            current: true,
          },
        ]
      : [{ label: t('breadcrumbHome'), href: `/${currentLang}`, current: true }];

  return (
    <LayoutProvider mode="full">
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <div className="sticky top-0 z-40">
          <AppTopBar
            logo={{
              src: '/logo.png',
              appName: CONSTANTS.APP_NAME,
              onClick: () => navigate(`/${currentLang}`),
            }}
            menuItems={[{ id: 'docs', label: t('nav.docs'), href: `/${currentLang}/docs` }]}
            languages={languages}
            currentLanguage={currentLang}
            onLanguageChange={(newLang: string) => {
              if (isSupported(newLang)) {
                const suffix = location.pathname.startsWith(`/${currentLang}/`)
                  ? location.pathname.slice(`/${currentLang}`.length)
                  : '';
                navigate(`/${newLang}${suffix}`);
              }
            }}
            LinkComponent={LinkWrapper}
          />
          <AppBreadcrumbs
            items={breadcrumbItems}
            shareConfig={{
              title: `${CONSTANTS.APP_NAME} — ${t('hero.title')}`,
              description: t('footer.description'),
              hashtags: [CONSTANTS.APP_NAME, 'ChromeExtension', 'ScreenRecording', 'WebDev'],
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
    ? buildHowToSchema(
        tHowTo('home.name'),
        tHowTo('home.description'),
        rawSteps as { name: string; text: string }[]
      )
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
      <ProblemSection />
      <HowItWorks />
      <Features />
      <Audiences />
      <PrivacySection />
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
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="docs/:topic" element={<DocsPage />} />
        </Route>
        <Route path="/privacy" element={<Layout />}>
          <Route index element={<PrivacyPolicyPage />} />
        </Route>
        <Route path="/support" element={<Layout />}>
          <Route index element={<SupportPage />} />
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
