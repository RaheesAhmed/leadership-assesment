"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClipboardList, LineChart, Users, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Assessments",
    icon: ClipboardList,
    href: "/dashboard/assessments",
    color: "text-violet-500",
  },
  {
    label: "Demographics",
    icon: Users,
    href: "/dashboard/demographics",
    color: "text-pink-700",
  },
  {
    label: "Development Plans",
    icon: LineChart,
    href: "/dashboard/plans",
    color: "text-orange-700",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link href={route.href} key={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start pl-3 mb-1",
                  pathname === route.href
                    ? "bg-white/10 hover:bg-white/20"
                    : "hover:bg-white/10"
                )}
              >
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
