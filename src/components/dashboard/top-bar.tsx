"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, Settings, Wallet, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface TopBarProps {
  user?: {
    email?: string;
    avatarUrl?: string;
  };
  walletBalance?: number;
  walletAddress?: string;
}

export function TopBar({ user, walletBalance = 0, walletAddress }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left side - Page title or breadcrumb */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">Dashboard</h2>
      </div>

      {/* Right side - Wallet, notifications, user */}
      <div className="flex items-center gap-4">
        {/* Wallet Balance */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center">
            <Wallet size={16} className="text-neon-cyan" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ARC Wallet</p>
            <p className="text-sm font-semibold text-white">
              {walletBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-neon-cyan">USDC</span>
            </p>
          </div>
          {shortAddress && (
            <span className="text-xs text-muted-foreground font-mono">
              {shortAddress}
            </span>
          )}
        </motion.div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl glass hover:bg-white/10 transition-colors"
          >
            <Bell size={20} className="text-muted-foreground" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="p-2 max-h-80 overflow-y-auto scrollbar-thin">
                  {/* Sample notifications */}
                  <div className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <p className="text-sm text-white">Agent found a ticket!</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <p className="text-sm text-white">Price dropped for Coldplay</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-xl glass hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "text-muted-foreground transition-transform",
                showUserMenu && "rotate-180"
              )}
            />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden"
              >
                {user?.email && (
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {user.email}
                    </p>
                  </div>
                )}
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <Settings size={18} className="text-muted-foreground" />
                    <span className="text-sm text-white">Settings</span>
                  </button>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-left text-red-400"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
