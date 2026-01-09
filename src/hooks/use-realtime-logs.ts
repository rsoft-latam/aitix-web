"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AgentLog {
  id: string;
  agentId: string;
  eventType: string;
  message: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export function useRealtimeLogs(agentId?: string, initialLogs: AgentLog[] = []) {
  const [logs, setLogs] = useState<AgentLog[]>(initialLogs);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to realtime changes on agent_logs table
    const channel = supabase
      .channel("agent-logs-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "agent_logs",
          filter: agentId ? `agent_id=eq.${agentId}` : undefined,
        },
        (payload) => {
          const newLog: AgentLog = {
            id: payload.new.id,
            agentId: payload.new.agent_id,
            eventType: payload.new.event_type,
            message: payload.new.message,
            payload: payload.new.payload,
            createdAt: payload.new.created_at,
          };

          setLogs((prev) => [newLog, ...prev]);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  return { logs, isConnected };
}
