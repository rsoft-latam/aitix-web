"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Search, Filter, ArrowUpDown, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Concert {
  id: number;
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

type SortOption = "date-asc" | "date-desc" | "price-asc" | "price-desc" | "name-asc";

export function ConcertsSection({ concerts }: ConcertsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-asc");

  // Get unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(concerts.map((c) => c.genre));
    return Array.from(genreSet).sort();
  }, [concerts]);

  // Filter and sort concerts
  const filteredConcerts = useMemo(() => {
    let filtered = concerts.filter((concert) => {
      const matchesSearch = concert.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "all" || concert.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    // Sort concerts
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.artist.localeCompare(b.artist);
        default:
          return 0;
      }
    });

    return filtered;
  }, [concerts, searchQuery, selectedGenre, sortBy]);

  return (
    <section id="concerts" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-4">
          Featured Concerts
        </h2>
        <p className="text-muted-foreground text-lg">
          Browse our curated selection of upcoming events
        </p>
      </div>

      {/* Search, Filter, and Sort Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search concerts by artist name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl glass-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all"
          />
        </div>

        {/* Filter and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Genre Filter */}
          <div className="flex-1">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-card border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-all appearance-none bg-transparent"
              >
                <option value="all" className="bg-card">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-card">
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="sm:w-64">
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-card border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all appearance-none bg-transparent"
              >
                <option value="date-asc" className="bg-card">Date: Earliest First</option>
                <option value="date-desc" className="bg-card">Date: Latest First</option>
                <option value="price-asc" className="bg-card">Price: Low to High</option>
                <option value="price-desc" className="bg-card">Price: High to Low</option>
                <option value="name-asc" className="bg-card">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredConcerts.length} of {concerts.length} concerts
        </div>
      </div>

      {/* Concert Cards Grid */}
      {filteredConcerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredConcerts.map((concert) => (
            <div
              key={concert.id}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:border-neon-purple/50 group relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/0 to-neon-blue/0 group-hover:from-neon-purple/5 group-hover:to-neon-blue/5 transition-all duration-300 pointer-events-none" />

              <div className="relative z-10">
                {/* Concert Image/Icon */}
                <div className="w-full h-48 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                  {concert.image.startsWith("/") ? (
                    <Image
                      src={concert.image}
                      alt={concert.artist}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-8xl">{concert.image}</span>
                  )}
                </div>

                {/* Artist Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{concert.artist}</h3>

                {/* Genre Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                    <Music2 className="w-3 h-3" />
                    {concert.genre}
                  </span>
                </div>

                {/* Venue & Location */}
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{concert.venue}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1 ml-6">
                  {concert.city}
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(concert.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm">• {concert.time}</span>
                </div>

                {/* Ticket Tier */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                    {concert.tier}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-white">
                      ${concert.price}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {concert.currency}
                    </span>
                  </div>
                  {concert.available && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      Available
                    </span>
                  )}
                </div>

                {/* Buy Now Button */}
                <Link
                  href="/login"
                  className="w-full block text-center py-3 px-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
            <Music2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No concerts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
