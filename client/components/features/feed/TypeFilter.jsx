import { filterPillClass } from "@/lib/filterPill";

const TYPES = [
  { value: "", label: "All" },
  { value: "UPDATE", label: "Update" },
  { value: "OFFER", label: "Offer" },
  { value: "EVENT", label: "Event" },
];

export default function TypeFilter({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {TYPES.map((type) => (
        <button
          key={type.value || "all"}
          type="button"
          onClick={() => onChange(type.value)}
          className={filterPillClass(value === type.value)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
