import { filterPillClass } from "@/lib/filterPill";

const RADII = [1, 3, 5, 10];

export default function RadiusSelector({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {RADII.map((radius) => (
        <button
          key={radius}
          type="button"
          onClick={() => onChange(radius)}
          className={filterPillClass(value === radius)}
        >
          {radius} km
        </button>
      ))}
    </div>
  );
}
