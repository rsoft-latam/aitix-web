"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Music, MapPin, Clock, Zap, Filter, Search } from "lucide-react";

export interface Concert {
  id: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  image: string;
  price: number;
  currency: string;
  tier: string;
  available: boolean;
  genre: string;
}

interface ConcertsSectionProps {
  concerts: Concert[];
}

export function ConcertsSection({ concerts }: ConcertsSectionProps) {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");

  // Get unique genres from concerts
  const genres = Array.from(new Set(concerts.map((c) => c.genre)));

  // Filter concerts based on selected filters
  let filteredConcerts = concerts.filter((concert) => {
    const genreMatch =
      selectedGenres.length === 0 || selectedGenres.includes(concert.genre);
    const availabilityMatch = !showAvailableOnly || concert.available;
    const searchMatch =
      concert.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concert.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concert.city.toLowerCase().includes(searchQuery.toLowerCase());

    return genreMatch && availabilityMatch && searchMatch;
  });

  // Sort concerts based on price sort option
  if (priceSort === "low-to-high") {
    filteredConcerts = [...filteredConcerts].sort((a, b) => a.price - b.price);
  } else if (priceSort === "high-to-low") {
    filteredConcerts = [...filteredConcerts].sort((a, b) => b.price - a.price);
  }

  const handleGetTickets = () => {
    router.push("/login");
  };

  return (
    <section id="concerts" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Upcoming Concerts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing concerts and get tickets with AI agents
          </p>
        </div>

        {/* Concerts Grid */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by artist, venue, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-neon-purple/50 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-neon-purple" />
              <h3 className="text-lg font-semibold text-white">Filters</h3>
            </div>

            <div className="space-y-4">
              {/* Genre Filter */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Genre
                </label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setSelectedGenres((prev) =>
                          prev.includes(genre)
                            ? prev.filter((g) => g !== genre)
                            : [...prev, genre]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-neon-purple text-white"
                          : "bg-white/10 text-muted-foreground hover:bg-white/20"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Sort */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Sort by Price
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPriceSort("none")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      priceSort === "none"
                        ? "bg-neon-purple text-white"
                        : "bg-white/10 text-muted-foreground hover:bg-white/20"
                    }`}
                  >
                    None
                  </button>
                  <button
                    onClick={() => setPriceSort("low-to-high")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      priceSort === "low-to-high"
                        ? "bg-neon-purple text-white"
                        : "bg-white/10 text-muted-foreground hover:bg-white/20"
                    }`}
                  >
                    Low to High
                  </button>
                  <button
                    onClick={() => setPriceSort("high-to-low")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      priceSort === "high-to-low"
                        ? "bg-neon-purple text-white"
                        : "bg-white/10 text-muted-foreground hover:bg-white/20"
                    }`}
                  >
                    High to Low
                  </button>
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    Available Only
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Concerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcerts.length > 0 ? (
            filteredConcerts.map((concert) => (
              <div
                key={concert.id}
                className="group glass-card rounded-xl overflow-hidden border border-white/10 hover:border-neon-purple/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-purple/20"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-neon-purple/20 to-neon-blue/20">
                  <Image
                    src={concert.image}
                    alt={concert.artist}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Genre Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-neon-purple/80 text-white backdrop-blur">
                    {concert.genre}
                  </div>

                  {/* Availability Badge */}
                  {concert.available && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/80 text-white backdrop-blur flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Artist Name */}
                  <h3 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors">
                    {concert.artist}
                  </h3>

                  {/* Venue Info */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neon-purple" />
                      <span>{concert.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neon-blue" />
                      <span>
                        {concert.date} at {concert.time}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Tier and Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neon-cyan">
                      {concert.tier}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gradient">
                        ${concert.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {concert.currency}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleGetTickets}
                    className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/50"
                  >
                    Get Tickets
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No concerts match your filters</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}