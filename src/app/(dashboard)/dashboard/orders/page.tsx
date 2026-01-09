import { Calendar, Download, Eye, Receipt, Ticket } from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    concert: "Coldplay - Estadio Nacional",
    date: "2024-01-05",
    tickets: 2,
    tier: "VIP",
    total: 360,
    status: "completed",
    txHash: "0x1234...5678",
  },
  {
    id: "ORD-002",
    concert: "Taylor Swift - MSG",
    date: "2024-01-08",
    tickets: 1,
    tier: "Platinum",
    total: 350,
    status: "processing",
    txHash: null,
  },
  {
    id: "ORD-003",
    concert: "The Weeknd - Wembley",
    date: "2024-01-10",
    tickets: 3,
    tier: "General",
    total: 360,
    status: "completed",
    txHash: "0xabcd...efgh",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  processing: "bg-yellow-500/20 text-yellow-400",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-gray-500/20 text-gray-400",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-muted-foreground">
            Your ticket purchases and transaction history
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-muted-foreground hover:text-white transition-colors">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              <Receipt size={24} className="text-neon-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
              <Ticket size={24} className="text-neon-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-sm text-muted-foreground">Tickets Purchased</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 font-bold">$</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1,070 USDC</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Order
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Concert
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Tickets
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-white">{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-white">{order.concert}</p>
                      <p className="text-xs text-muted-foreground">{order.tier} Tier</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      {order.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-white">{order.tickets}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-neon-cyan">
                      {order.total} USDC
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                        <Eye size={16} />
                      </button>
                      {order.txHash && (
                        <a
                          href={`https://explorer.arc.network/tx/${order.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-neon-cyan"
                        >
                          <Receipt size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
