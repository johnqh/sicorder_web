interface StepCardProps {
  number: number;
  title: string;
  text: string;
}

export default function StepCard({ number, title, text }: StepCardProps) {
  return (
    <li className="glass rounded-2xl p-6 sm:p-8 list-none">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-record text-white font-semibold mb-5">
        {number}
      </span>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{text}</p>
    </li>
  );
}
