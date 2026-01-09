"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Music,
  ShoppingCart,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Concerts", href: "/dashboard/concerts", icon: Music },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Watchlist", href: "/dashboard/watchlist", icon: Eye },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen glass-card border-r border-white/10 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl text-gradient">AItix</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-neon-purple to-neon-blue"
                  />
                )}

                <Icon size={20} className={cn(isActive && "text-neon-purple")} />

                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-card border border-white/10 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground text-center"
            >
              <p>RSoft Latam</p>
              <p className="text-neon-purple/70">v0.1.0</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center"
            >
              <span className="text-xs font-bold text-neon-purple">R</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
