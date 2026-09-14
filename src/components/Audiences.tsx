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

const AUDIENCES: { key: string; icon: ReactNode }[] = [
  { key: 'developers', icon: svg('M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14') },
  { key: 'designers', icon: svg('M4 20h4L18.5 9.5a2.8 2.8 0 00-4-4L4 16v4z') },
  { key: 'marketers', icon: svg('M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zM16 8a5 5 0 010 8') },
  { key: 'support', icon: svg('M8 10h8M8 14h5M21 12a9 9 0 01-13.5 7.8L3 21l1.2-4.5A9 9 0 1121 12z') },
];

export default function Audiences() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          {t('audiences.title')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {AUDIENCES.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`audiences.items.${key}.title`)}
              text={t(`audiences.items.${key}.text`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
