import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-neon-blue/10 -z-10" />

      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-bold text-gradient animate-pulse-slow">
            AItix
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mt-4">
            Agentic Commerce Platform
          </p>
        </div>

        {/* Description */}
        <p className="max-w-2xl text-muted-foreground text-lg">
          Autonomous ticket purchasing powered by AI agents on the ARC network.
          Set your preferences, define your budget, and let intelligent agents
          secure the best tickets for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="glass-card px-8 py-4 rounded-xl text-lg font-semibold text-white hover:neon-glow-purple transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="glass px-8 py-4 rounded-xl text-lg font-semibold text-muted-foreground hover:text-white hover:border-neon-purple/50 transition-all duration-300"
          >
            Dashboard
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Autonomous Agents</h3>
            <p className="text-muted-foreground text-sm">
              AI-powered agents that monitor and purchase tickets on your behalf
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-neon-blue/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Mandates</h3>
            <p className="text-muted-foreground text-sm">
              Define budget limits and preferences with cryptographic guarantees
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">ARC Network</h3>
            <p className="text-muted-foreground text-sm">
              Built on the ARC network with AP2 protocol for seamless transactions
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center text-sm text-muted-foreground">
        <p>RSoft Latam &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
