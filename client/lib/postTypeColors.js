const POST_TYPE_COLORS = {
  UPDATE: { label: "Update", marker: "#8a857c", dot: "bg-[#8a857c]" },
  OFFER: { label: "Offer", marker: "#b0532a", dot: "bg-[#b0532a]" },
  EVENT: { label: "Event", marker: "#1f7a52", dot: "bg-[#1f7a52]" },
};

export function getPostTypeColor(type) {
  return POST_TYPE_COLORS[type] || POST_TYPE_COLORS.UPDATE;
}

export function getPostTypeEntries() {
  return Object.entries(POST_TYPE_COLORS).map(([type, meta]) => ({ type, ...meta }));
}
