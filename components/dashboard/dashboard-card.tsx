import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
export function DashboardCard({ label, value, detail, icon: Icon, tone = "green" }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: string }) { return <Card className="metric-card"><span className={`metric-icon ${tone}`}><Icon size={19}/></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></Card>; }
