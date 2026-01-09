"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertCircle, CheckCircle, Clock, Search, Ticket, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtimeLogs } from "@/hooks/use-realtime-logs";

interface AgentLog {
  id: string;
  agentId: string;
  eventType: string;
  message: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

const eventTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  started: { icon: Zap, color: "text-neon-blue" },
  searching: { icon: Search, color: "text-neon-purple" },
  found_ticket: { icon: Ticket, color: "text-neon-cyan" },
  price_check: { icon: Activity, color: "text-yellow-400" },
  purchase_attempt: { icon: Clock, color: "text-orange-400" },
  success: { icon: CheckCircle, color: "text-green-400" },
  error: { icon: AlertCircle, color: "text-red-400" },
  default: { icon: Activity, color: "text-muted-foreground" },
};

interface AgentLogsPanelProps {
  agentId?: string;
  initialLogs?: AgentLog[];
}

export function AgentLogsPanel({ agentId, initialLogs = [] }: AgentLogsPanelProps) {
  const { logs } = useRealtimeLogs(agentId, initialLogs);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredLogs = filter
    ? logs.filter((log) => log.eventType === filter)
    : logs;

  const eventTypes = Array.from(new Set(logs.map((log) => log.eventType)));

  return (
    <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center">
            <Activity size={20} className="text-neon-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Agent Logs</h3>
            <p className="text-xs text-muted-foreground">Real-time activity feed</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Filters */}
      {eventTypes.length > 0 && (
        <div className="p-3 border-b border-white/10 flex gap-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              filter === null
                ? "bg-white/10 text-white"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            All
          </button>
          {eventTypes.map((type) => {
            const config = eventTypeConfig[type] || eventTypeConfig.default;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  filter === type
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {type.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      )}

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredLogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-48 text-muted-foreground"
            >
              <Activity size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No logs yet</p>
              <p className="text-xs">Agent activity will appear here</p>
            </motion.div>
          ) : (
            filteredLogs.map((log) => {
              const config = eventTypeConfig[log.eventType] || eventTypeConfig.default;
              const Icon = config.icon;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className="group glass rounded-xl p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0",
                        config.color
                      )}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-xs font-medium uppercase",
                            config.color
                          )}
                        >
                          {log.eventType.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-white">{log.message}</p>

                      {/* Payload preview */}
                      {log.payload && Object.keys(log.payload).length > 0 && (
                        <motion.pre
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-2 p-2 rounded-lg bg-white/5 text-xs text-muted-foreground font-mono overflow-x-auto scrollbar-thin"
                        >
                          {JSON.stringify(log.payload, null, 2)}
                        </motion.pre>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
