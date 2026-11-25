import type { Category } from "@/features/categories/category.types";

type CategoryFilterProps = {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
};

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          selected === null
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600"
        }`}
      >
        Semua
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            selected === category.id
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
