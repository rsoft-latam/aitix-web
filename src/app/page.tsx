import Link from "next/link";
import Image from "next/image";

import { Music, ArrowRight } from "lucide-react";
import { ConcertsSection, type Concert } from "@/components/home/concerts-section";
import { getConcerts } from "@/lib/actions/concerts";

export default async function Home() {
  const concerts = await getConcerts();

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-neon-blue/10 -z-10" />
      <div className="fixed inset-0 grid-bg opacity-20 -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gradient">AItix</h1>
              <Music className="w-6 h-6 text-neon-purple" />
            </Link>

            {/* Login/Signup Button */}
            <Link
              href="/login"
              className="glass-card px-6 py-2 rounded-xl font-semibold text-white hover:neon-glow-purple transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Login / Sign Up
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-20">
          <Image 
            src= "/Hero-Section-Background.png"
            alt=""
            height={1000}
            width={1000}
            
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Particles */}
        <div className="particles absolute inset-0 -z-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Powered by AI Agents on ARC Network
              </span>
            </div>

            {/* Main Heading with Hover Effects */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
                <span className="inline-block word-hover text-gradient opacity-60 hover:opacity-100 transition-all duration-300 hover:text-shadow-glow cursor-default">
                  Discover
                </span>
                <br />
                <span className="inline-block word-hover text-gradient opacity-60 hover:opacity-100 transition-all duration-300 hover:text-shadow-glow cursor-default">
                  Amazing
                </span>
                <br />
                <span className="inline-block word-hover text-gradient opacity-60 hover:opacity-100 transition-all duration-300 hover:text-shadow-glow cursor-default">
                  Concerts
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Experience live music like never before. Get tickets to the hottest concerts 
              powered by autonomous AI agents on the ARC network.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="#concerts"
                className="group glass-card px-8 py-4 rounded-xl text-lg font-semibold text-white hover:neon-glow-purple transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Explore Concerts
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-neon-purple to-neon-blue text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Stats/Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-neon-purple/30 transition-all duration-300">
                <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">AI Agent Monitoring</div>
              </div>
              <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-neon-blue/30 transition-all duration-300">
                <div className="text-3xl font-bold text-gradient mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Secure Transactions</div>
              </div>
              <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-neon-cyan/30 transition-all duration-300">
                <div className="text-3xl font-bold text-gradient mb-2">Instant</div>
                <div className="text-sm text-muted-foreground">Ticket Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concerts Section */}
      <ConcertsSection concerts={concerts} />

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>RSoft Latam &copy; {new Date().getFullYear()}</p>
            <p className="mt-2">Autonomous ticket purchasing powered by AI agents on the ARC network</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
