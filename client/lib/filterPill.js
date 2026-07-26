export function filterPillClass(active) {
  return `h-8 rounded-full px-3 text-xs font-medium transition-colors ${
    active
      ? "bg-foreground text-background"
      : "border border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
  }`;
}
