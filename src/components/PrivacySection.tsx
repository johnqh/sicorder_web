import { useTranslation } from 'react-i18next';

const NOTES = ['pages', 'audio', 'pointer'] as const;

export default function PrivacySection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t('privacy.title')}</h2>
          <p className="text-white/70">{t('privacy.text')}</p>
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t('goodToKnow.title')}</h2>
          <ul className="space-y-3">
            {NOTES.map(key => (
              <li key={key} className="flex gap-3 text-white/70">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-record"
                />
                <span>{t(`goodToKnow.items.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
