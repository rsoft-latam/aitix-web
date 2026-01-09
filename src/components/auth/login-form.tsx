"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const action = mode === "signin" ? signInWithEmail : signUpWithEmail;
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Glass Card */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-blue/10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">AItix</h1>
            <p className="text-muted-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                mode === "signin"
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                mode === "signup"
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all disabled:opacity-50"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-xl glass border border-white/10 text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        By continuing, you agree to our{" "}
        <a href="#" className="text-neon-purple hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-neon-purple hover:underline">
          Privacy Policy
        </a>
      </p>
    </motion.div>
  );
}
