import { Bot, Music, ShoppingCart, Ticket, TrendingUp, Wallet } from "lucide-react";
import { AgentLogsPanel } from "@/components/dashboard/agent-logs-panel";

// Mock data for demonstration
const mockStats = [
  { name: "Active Agents", value: "3", change: "+2", icon: Bot, color: "neon-purple" },
  { name: "Watching", value: "12", change: "+5", icon: Music, color: "neon-blue" },
  { name: "Orders", value: "7", change: "+1", icon: ShoppingCart, color: "neon-cyan" },
  { name: "Tickets", value: "15", change: "+3", icon: Ticket, color: "neon-pink" },
];

const mockLogs = [
  {
    id: "1",
    agentId: "agent-1",
    eventType: "searching",
    message: "Scanning ARC network for Coldplay tickets...",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    agentId: "agent-1",
    eventType: "price_check",
    message: "VIP tier available at 180 USDC (within budget)",
    payload: { tier: "VIP", price: 180, budget: 200 },
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "3",
    agentId: "agent-2",
    eventType: "started",
    message: "Agent activated for Taylor Swift concert",
    createdAt: new Date(Date.now() - 120000).toISOString(),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your agents
          </p>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
          <TrendingUp size={18} className="text-green-400" />
          <span className="text-sm text-green-400">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}
                >
                  <Icon size={24} className={`text-${stat.color}`} />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Logs - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AgentLogsPanel initialLogs={mockLogs} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Wallet Card */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                <Wallet size={20} className="text-neon-cyan" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ARC Wallet Balance</p>
                <p className="text-2xl font-bold text-white">1,250.00 USDC</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-medium hover:opacity-90 transition-opacity">
              Add Funds
            </button>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Ticket size={16} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">Ticket purchased</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                  <Bot size={16} className="text-neon-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">Agent deployed</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center">
                  <Music size={16} className="text-neon-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">Added to watchlist</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
