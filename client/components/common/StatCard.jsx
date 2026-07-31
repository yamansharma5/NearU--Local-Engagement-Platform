import { Card } from "@/components/ui/card";

export default function StatCard({ label, value, icon: Icon, note }) {
  return (
    <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-sm font-medium text-foreground/80">{label}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{note}</p>
    </Card>
  );
}
