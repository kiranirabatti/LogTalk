import useCountUp from '../hooks/useCountUp';

interface ImpactCardProps {
  label: string;
  value: string | number;
  icon: string;
  sublabel?: string;
  animateNumber?: number;
}

const ImpactCard = ({ label, value, icon, sublabel, animateNumber }: ImpactCardProps) => {
  const animated = useCountUp(animateNumber ?? 0, 900);
  const displayValue = animateNumber !== undefined ? animated.toLocaleString('en-IN') : value;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-indigo-800/40 dark:from-indigo-950/30 dark:via-slate-800 dark:to-indigo-950/20">
      <div className="absolute -right-4 -top-4 text-6xl opacity-[0.07]">{icon}</div>
      <div className="relative">
        <div className="mb-1 text-sm font-medium text-indigo-500 dark:text-indigo-400">{label}</div>
        <div className="text-4xl font-extrabold tracking-tight text-indigo-950 dark:text-indigo-100">{displayValue}</div>
        {sublabel && (
          <div className="mt-1 text-xs text-indigo-400 dark:text-indigo-500">{sublabel}</div>
        )}
      </div>
    </div>
  );
};

export default ImpactCard;
