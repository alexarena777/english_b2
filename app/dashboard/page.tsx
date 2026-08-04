import type { Metadata } from "next";
import { AppPage } from "@/components/app-shell";
import { DashboardView } from "@/components/dashboard/dashboard-view";
export const metadata: Metadata = { title: "Dashboard" };
export default function DashboardPage() { return <AppPage><DashboardView/></AppPage>; }
