export function filterPillClass(active) {
  return `h-10 rounded-full px-4 text-sm font-medium transition-colors ${
    active
      ? "bg-foreground text-background shadow-sm"
      : "border border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
  }`;
}
