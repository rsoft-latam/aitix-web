import { Calendar, MapPin, Music, Plus, Users } from "lucide-react";

const mockConcerts = [
  {
    id: "1",
    artist: "Coldplay",
    venue: "Estadio Nacional",
    city: "Lima",
    country: "Peru",
    date: "2024-03-15T20:00:00Z",
    imageUrl: "/coldplay.jpg",
    status: "on_sale",
    lowestPrice: 80,
    capacity: 55000,
  },
  {
    id: "2",
    artist: "Taylor Swift",
    venue: "Madison Square Garden",
    city: "New York",
    country: "USA",
    date: "2024-04-20T19:00:00Z",
    imageUrl: "/taylor.jpg",
    status: "on_sale",
    lowestPrice: 150,
    capacity: 20000,
  },
  {
    id: "3",
    artist: "Bad Bunny",
    venue: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    date: "2024-05-10T21:00:00Z",
    imageUrl: "/badbunny.jpg",
    status: "upcoming",
    lowestPrice: 90,
    capacity: 87000,
  },
  {
    id: "4",
    artist: "The Weeknd",
    venue: "Wembley Stadium",
    city: "London",
    country: "UK",
    date: "2024-06-01T20:00:00Z",
    imageUrl: "/weeknd.jpg",
    status: "upcoming",
    lowestPrice: 120,
    capacity: 90000,
  },
];

const statusColors: Record<string, string> = {
  upcoming: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  on_sale: "bg-green-500/20 text-green-400 border-green-500/30",
  sold_out: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function ConcertsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Concerts</h1>
          <p className="text-muted-foreground">
            Browse upcoming concerts and deploy agents
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-medium hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add to Watchlist
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium">
          All
        </button>
        <button className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-white/5 text-sm font-medium transition-colors">
          On Sale
        </button>
        <button className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-white/5 text-sm font-medium transition-colors">
          Upcoming
        </button>
        <button className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-white/5 text-sm font-medium transition-colors">
          In Watchlist
        </button>
      </div>

      {/* Concert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockConcerts.map((concert) => (
          <div
            key={concert.id}
            className="glass-card rounded-xl overflow-hidden hover:scale-[1.02] transition-transform group"
          >
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center relative">
              <Music size={48} className="text-white/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span
                className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium border ${
                  statusColors[concert.status]
                }`}
              >
                {concert.status.replace("_", " ")}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-white text-lg">{concert.artist}</h3>
                <p className="text-sm text-muted-foreground">{concert.venue}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {concert.city}, {concert.country}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  {concert.capacity.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                {new Date(concert.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-lg font-bold text-neon-cyan">
                    {concert.lowestPrice} USDC
                  </p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-neon-purple/20 text-neon-purple text-sm font-medium hover:bg-neon-purple/30 transition-colors">
                  Deploy Agent
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
