export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}
