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
        <img
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          className="mx-auto mb-8 h-20 w-20 sm:h-24 sm:w-24"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="gradient-text">{t('hero.title')}</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
          {t('hero.subtitle')}
        </p>
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
