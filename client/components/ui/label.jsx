import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "mb-2 block text-sm font-medium text-foreground/80 select-none",
        className
      )}
      {...props}
    />
  );
}

export { Label };
