interface ImpactCardProps {
  label: string;
  value: string | number;
  icon: string;
}

const ImpactCard = ({ label, value, icon }: ImpactCardProps) => {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 text-center">
      <div className="mb-2 text-2xl">{icon}</div>
      <div className="text-3xl font-bold text-indigo-900">{value}</div>
      <div className="mt-1 text-sm text-indigo-600">{label}</div>
    </div>
  );
};

export default ImpactCard;
