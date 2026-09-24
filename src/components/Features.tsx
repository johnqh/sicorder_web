import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import FeatureCard from './FeatureCard';

const svg = (d: string): ReactNode => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const FEATURES: { key: string; icon: ReactNode }[] = [
  { key: 'exact', icon: svg('M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4') },
  { key: 'smart', icon: svg('M13 10V3L4 14h7v7l9-11h-7z') },
  { key: 'pause', icon: svg('M10 9v6m4-6v6M12 21a9 9 0 100-18 9 9 0 000 18z') },
  { key: 'autoStop', icon: svg('M9 10h6v4H9zM12 21a9 9 0 100-18 9 9 0 000 18z') },
  { key: 'names', icon: svg('M7 7h.01M7 3h5l8 8-9 9-8-8V7a4 4 0 014-4z') },
  { key: 'still', icon: svg('M4 8h3l2-3h6l2 3h3v11H4V8zm8 9a4 4 0 100-8 4 4 0 000 8z') },
  { key: 'scroll', icon: svg('M12 4v16m0-16l-4 4m4-4l4 4m-4 12l-4-4m4 4l4-4') },
  {
    key: 'share',
    icon: svg(
      'M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zm12 7a3 3 0 100-6 3 3 0 000 6z'
    ),
  },
  {
    key: 'audio',
    icon: svg('M12 3v18m0-18a3 3 0 013 3v12a3 3 0 01-6 0V6a3 3 0 013-3zm7 5v8a7 7 0 01-14 0V8'),
  },
];

export default function Features() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          {t('features.title')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
