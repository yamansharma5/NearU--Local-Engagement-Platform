import { Card } from "@/components/ui/card";

export default function StatCard({ label, value, icon: Icon, note }) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
        <Icon className="h-4.5 w-4.5 text-accent-foreground" />
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      <p className="mt-1 text-sm font-medium text-foreground/80">{label}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </Card>
  );
}
