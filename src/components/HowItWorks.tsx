import { useTranslation } from 'react-i18next';
import StepCard from './StepCard';

const STEPS = ['pick', 'record', 'stop'] as const;

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          {t('howItWorks.title')}
        </h2>
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
