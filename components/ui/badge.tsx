import { cn } from "@/lib/utils";
export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "neutral"; className?: string }) { return <span className={cn("badge", `badge-${variant}`, className)}>{children}</span>; }
