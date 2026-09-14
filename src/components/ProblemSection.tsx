import { useTranslation } from 'react-i18next';

export default function ProblemSection() {
  const { t } = useTranslation();
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5">{t('problem.title')}</h2>
        <p className="text-lg text-white/70">{t('problem.text')}</p>
      </div>
    </section>
  );
}
