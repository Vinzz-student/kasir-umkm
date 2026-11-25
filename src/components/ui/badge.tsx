type Props = {
  children: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "gray" | "red";
};

export default function Badge({
  children,
  color = "gray",
}: Props) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}
