"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  UserCircle,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
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
    label: "Development Plans",
    icon: FileText,
    href: "/dashboard/plans",
    color: "text-pink-700",
  },
  {
    label: "Demographics",
    icon: UserCircle,
    href: "/dashboard/demographics",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-700",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <motion.div
      className={cn(
        "flex flex-col h-full bg-gray-900 text-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
      animate={{ width: isCollapsed ? "80px" : "256px" }}
    >
      <div className="px-3 py-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center">
            <motion.h1
              className={cn(
                "text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent",
                isCollapsed && "hidden"
              )}
              animate={{
                opacity: isCollapsed ? 0 : 1,
                scale: isCollapsed ? 0.5 : 1,
              }}
            >
              AssessHub
            </motion.h1>
            {isCollapsed && (
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <span className="text-xl font-bold text-white">A</span>
              </motion.div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              className={cn(
                "h-6 w-6 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
        <nav className="space-y-2 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center p-3 w-full rounded-lg transition-colors",
                pathname === route.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              <motion.span
                className="text-sm font-medium"
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : "auto",
                }}
              >
                {route.label}
              </motion.span>
              {pathname === route.href && (
                <motion.div
                  className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                  layoutId="activeRoute"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-auto text-zinc-400 hover:text-white hover:bg-white/5 justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <motion.span
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : "auto",
            }}
          >
            Log out
          </motion.span>
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
