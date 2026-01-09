import { Bell, BellOff, Bot, Calendar, MapPin, Trash2 } from "lucide-react";

const mockWatchlist = [
  {
    id: "1",
    concert: {
      artist: "Coldplay",
      venue: "Estadio Nacional",
      city: "Lima",
      date: "2024-03-15T20:00:00Z",
    },
    targetPrice: 150,
    currentPrice: 180,
    notifyOnly: false,
    hasAgent: true,
    addedAt: "2024-01-05",
  },
  {
    id: "2",
    concert: {
      artist: "Taylor Swift",
      venue: "Madison Square Garden",
      city: "New York",
      date: "2024-04-20T19:00:00Z",
    },
    targetPrice: 200,
    currentPrice: 350,
    notifyOnly: true,
    hasAgent: false,
    addedAt: "2024-01-08",
  },
  {
    id: "3",
    concert: {
      artist: "Bad Bunny",
      venue: "Estadio Azteca",
      city: "Mexico City",
      date: "2024-05-10T21:00:00Z",
    },
    targetPrice: 100,
    currentPrice: 90,
    notifyOnly: false,
    hasAgent: false,
    addedAt: "2024-01-10",
  },
];

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-muted-foreground">
            Track concerts and get notified when prices drop
          </p>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-4">
        {mockWatchlist.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-white mb-2">Your watchlist is empty</p>
            <p className="text-muted-foreground">
              Add concerts to your watchlist to track prices and deploy agents
            </p>
          </div>
        ) : (
          mockWatchlist.map((item) => {
            const priceMatch = item.currentPrice <= item.targetPrice;

            return (
              <div
                key={item.id}
                className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Concert Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {item.concert.artist}
                      </h3>
                      {item.hasAgent && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-purple/20 text-neon-purple text-xs font-medium">
                          <Bot size={12} />
                          Agent Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {item.concert.venue}, {item.concert.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.concert.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Added {item.addedAt}
                    </p>
                  </div>

                  {/* Price Info */}
                  <div className="text-right">
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        Current Price
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          priceMatch ? "text-green-400" : "text-white"
                        }`}
                      >
                        {item.currentPrice} USDC
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Target Price
                      </p>
                      <p className="text-lg text-neon-cyan">{item.targetPrice} USDC</p>
                    </div>

                    {priceMatch && (
                      <div className="mt-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium inline-block">
                        Price matched!
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        item.notifyOnly
                          ? "bg-neon-blue/20 text-neon-blue"
                          : "hover:bg-white/10 text-muted-foreground hover:text-white"
                      }`}
                      title={item.notifyOnly ? "Notifications enabled" : "Enable notifications"}
                    >
                      {item.notifyOnly ? <Bell size={18} /> : <BellOff size={18} />}
                    </button>

                    {!item.hasAgent && (
                      <button
                        className="p-2 rounded-lg hover:bg-neon-purple/20 transition-colors text-muted-foreground hover:text-neon-purple"
                        title="Deploy agent"
                      >
                        <Bot size={18} />
                      </button>
                    )}

                    <button
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-muted-foreground hover:text-red-400"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
