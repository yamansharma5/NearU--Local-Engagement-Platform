const CATEGORY_COLORS = {
  food: { text: "text-orange-300", dot: "bg-orange-400", marker: "#fb923c" },
  retail: { text: "text-sky-300", dot: "bg-sky-400", marker: "#38bdf8" },
  services: { text: "text-violet-300", dot: "bg-violet-400", marker: "#a78bfa" },
  events: { text: "text-amber-300", dot: "bg-amber-400", marker: "#fbbf24" },
  health: { text: "text-rose-300", dot: "bg-rose-400", marker: "#fb7185" },
};

const DEFAULT_COLOR = { text: "text-emerald-300", dot: "bg-emerald-400", marker: "#34d399" };

export function getCategoryColor(slug) {
  return CATEGORY_COLORS[slug] || DEFAULT_COLOR;
}
