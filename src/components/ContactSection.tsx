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
          <svg
            className="h-5 w-5 text-record-soft"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-lg text-white break-all">{CONSTANTS.SUPPORT_EMAIL}</span>
        </a>
      </div>
    </section>
  );
}
