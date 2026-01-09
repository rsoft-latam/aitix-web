import { Bot, Play, Pause, Trash2, Eye } from "lucide-react";
import { MandateConfigurator } from "@/components/agents/mandate-configurator";

// Mock data
const mockConcerts = [
  {
    id: "1",
    artistName: "Coldplay",
    venueName: "Estadio Nacional",
    date: "2024-03-15T20:00:00Z",
  },
  {
    id: "2",
    artistName: "Taylor Swift",
    venueName: "Madison Square Garden",
    date: "2024-04-20T19:00:00Z",
  },
  {
    id: "3",
    artistName: "Bad Bunny",
    venueName: "Estadio Azteca",
    date: "2024-05-10T21:00:00Z",
  },
];

const mockTiers = [
  { id: "1", name: "General", priceUsdc: 80, available: 500 },
  { id: "2", name: "VIP", priceUsdc: 180, available: 100 },
  { id: "3", name: "Platinum", priceUsdc: 350, available: 25 },
];

const mockAgents = [
  {
    id: "agent-1",
    concertName: "Coldplay - Estadio Nacional",
    status: "active",
    budget: 200,
    created: "2024-01-05",
  },
  {
    id: "agent-2",
    concertName: "Taylor Swift - MSG",
    status: "searching",
    budget: 500,
    created: "2024-01-08",
  },
  {
    id: "agent-3",
    concertName: "Bad Bunny - Estadio Azteca",
    status: "idle",
    budget: 150,
    created: "2024-01-10",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400",
  searching: "bg-neon-purple/20 text-neon-purple",
  idle: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-neon-cyan/20 text-neon-cyan",
  failed: "bg-red-500/20 text-red-400",
};

async function handleCreateAgent() {
  "use server";
  // This would be implemented with the createAgent action
}

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-muted-foreground">
            Manage your autonomous ticket purchasing agents
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Agent */}
        <MandateConfigurator
          concerts={mockConcerts}
          ticketTiers={mockTiers}
          onSubmit={async (config) => {
            "use server";
            console.log("Creating agent with config:", config);
          }}
        />

        {/* Active Agents List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Agents</h2>

          {mockAgents.length === 0 ? (
            <div className="glass-card p-8 rounded-xl text-center">
              <Bot size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No agents created yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first agent using the form
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="glass-card p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                        <Bot size={20} className="text-neon-purple" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{agent.concertName}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {agent.created}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[agent.status]
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Budget:{" "}
                      <span className="text-neon-cyan">{agent.budget} USDC</span>
                    </p>

                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                        <Eye size={16} />
                      </button>
                      {agent.status === "idle" ? (
                        <button className="p-2 rounded-lg hover:bg-green-500/20 transition-colors text-muted-foreground hover:text-green-400">
                          <Play size={16} />
                        </button>
                      ) : agent.status === "active" || agent.status === "searching" ? (
                        <button className="p-2 rounded-lg hover:bg-yellow-500/20 transition-colors text-muted-foreground hover:text-yellow-400">
                          <Pause size={16} />
                        </button>
                      ) : null}
                      <button className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-muted-foreground hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
