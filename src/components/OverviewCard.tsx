interface ICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const OverviewCard: React.FC<ICardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div
        className={`p-2 rounded-full text-white ${color}`}
        style={{
          boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`,
        }}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="mt-2 text-3xl font-extrabold text-gray-900">{value}</p>
  </div>
);

export default OverviewCard;
