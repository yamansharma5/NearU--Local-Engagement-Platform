import { getCategoryColor } from "@/lib/categoryColors";
import { filterPillClass } from "@/lib/filterPill";

export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" onClick={() => onChange("")} className={filterPillClass(value === "")}>
        All categories
      </button>
      {categories.map((category) => {
        const active = value === category.id;
        const color = getCategoryColor(category.slug);
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`inline-flex items-center gap-1.5 ${filterPillClass(active)}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
