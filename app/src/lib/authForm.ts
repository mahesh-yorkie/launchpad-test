import { cn } from "@/lib/utils";

export const authFieldClassName = cn(
  "h-11 border-[hsl(var(--primary))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
  "focus-visible:border-[hsl(var(--primary))] focus-visible:ring-[hsl(var(--ring))]",
);

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
