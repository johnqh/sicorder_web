import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export default function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <div className="glass rounded-2xl p-6 h-full">
      <div className="h-10 w-10 rounded-lg bg-record/15 text-record-soft flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{text}</p>
    </div>
  );
}
