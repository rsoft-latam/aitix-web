"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Music,
  DollarSign,
  Clock,
  Ticket,
  Shield,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Concert {
  id: string;
  artistName: string;
  venueName: string;
  date: string;
  imageUrl?: string;
}

interface TicketTier {
  id: string;
  name: string;
  priceUsdc: number;
  available: number;
}

interface MandateConfig {
  concertId: string;
  maxBudget: number;
  quantity: number;
  preferredTiers: string[];
  validUntil: string;
  autoApprove: boolean;
  fallbackBehavior: "wait" | "next_best" | "cancel";
}

interface MandateConfiguratorProps {
  concerts?: Concert[];
  ticketTiers?: TicketTier[];
  onSubmit: (config: MandateConfig) => Promise<void>;
}

const steps = [
  { id: 1, name: "Concert", icon: Music },
  { id: 2, name: "Budget", icon: DollarSign },
  { id: 3, name: "Time", icon: Clock },
  { id: 4, name: "Preferences", icon: Ticket },
  { id: 5, name: "Confirm", icon: Shield },
];

export function MandateConfigurator({
  concerts = [],
  ticketTiers = [],
  onSubmit,
}: MandateConfiguratorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<MandateConfig>({
    concertId: "",
    maxBudget: 100,
    quantity: 1,
    preferredTiers: [],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    autoApprove: false,
    fallbackBehavior: "wait",
  });

  const selectedConcert = concerts.find((c) => c.id === config.concertId);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(config);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!config.concertId;
      case 2:
        return config.maxBudget > 0 && config.quantity > 0;
      case 3:
        return !!config.validUntil;
      case 4:
        return true; // Preferences are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white mb-2">Create Agent Mandate</h2>
        <p className="text-sm text-muted-foreground">
          Configure your autonomous agent with budget and time guardrails
        </p>
      </div>

      {/* Step Indicator */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-gradient-to-br from-neon-purple to-neon-blue"
                      : isCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/5 text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </motion.div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-2",
                      isCompleted ? "bg-green-500/50" : "bg-white/10"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Concert Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-white">Select Concert</h3>
              <div className="grid gap-3">
                {concerts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No concerts available. Add concerts to your watchlist first.
                  </p>
                ) : (
                  concerts.map((concert) => (
                    <motion.button
                      key={concert.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setConfig({ ...config, concertId: concert.id })}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-colors",
                        config.concertId === concert.id
                          ? "bg-neon-purple/20 border border-neon-purple/50"
                          : "glass hover:bg-white/10"
                      )}
                    >
                      <p className="font-medium text-white">{concert.artistName}</p>
                      <p className="text-sm text-muted-foreground">
                        {concert.venueName} • {new Date(concert.date).toLocaleDateString()}
                      </p>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Budget Configuration */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-white">Set Budget Limits</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Maximum Budget (USDC)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.maxBudget}
                    onChange={(e) =>
                      setConfig({ ...config, maxBudget: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.quantity}
                    onChange={(e) =>
                      setConfig({ ...config, quantity: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
                <p className="text-sm text-neon-blue">
                  Maximum total spend: {(config.maxBudget * config.quantity).toLocaleString()} USDC
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Time Window */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-white">Set Time Window</h3>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Mandate Valid Until
                </label>
                <input
                  type="datetime-local"
                  value={config.validUntil.slice(0, 16)}
                  onChange={(e) =>
                    setConfig({ ...config, validUntil: new Date(e.target.value).toISOString() })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                />
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-400">
                  The agent will stop searching after this date, even if no tickets are found.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-white">Ticket Preferences</h3>

              <div className="space-y-3">
                {ticketTiers.map((tier) => (
                  <label
                    key={tier.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                      config.preferredTiers.includes(tier.id)
                        ? "bg-neon-purple/20 border border-neon-purple/50"
                        : "glass hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={config.preferredTiers.includes(tier.id)}
                        onChange={(e) => {
                          const tiers = e.target.checked
                            ? [...config.preferredTiers, tier.id]
                            : config.preferredTiers.filter((t) => t !== tier.id);
                          setConfig({ ...config, preferredTiers: tiers });
                        }}
                        className="w-4 h-4 rounded accent-neon-purple"
                      />
                      <span className="text-white font-medium">{tier.name}</span>
                    </div>
                    <span className="text-neon-cyan">{tier.priceUsdc} USDC</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  If preferred tier unavailable:
                </label>
                <select
                  value={config.fallbackBehavior}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      fallbackBehavior: e.target.value as MandateConfig["fallbackBehavior"],
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                >
                  <option value="wait">Wait for availability</option>
                  <option value="next_best">Purchase next best option</option>
                  <option value="cancel">Cancel and notify me</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-4 rounded-xl glass cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoApprove}
                  onChange={(e) => setConfig({ ...config, autoApprove: e.target.checked })}
                  className="w-4 h-4 rounded accent-neon-purple"
                />
                <div>
                  <p className="text-white font-medium">Auto-approve purchases</p>
                  <p className="text-sm text-muted-foreground">
                    Agent will purchase immediately without confirmation
                  </p>
                </div>
              </label>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-white">Confirm Mandate</h3>

              <div className="glass rounded-xl p-4 space-y-3">
                {selectedConcert && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Concert</span>
                    <span className="text-white">{selectedConcert.artistName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Budget</span>
                  <span className="text-neon-cyan">{config.maxBudget} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-white">{config.quantity} tickets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span className="text-white">
                    {new Date(config.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto-approve</span>
                  <span className={config.autoApprove ? "text-green-400" : "text-yellow-400"}>
                    {config.autoApprove ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
                <p className="text-sm text-neon-purple">
                  By confirming, you authorize the agent to operate within these constraints.
                  This creates a signed Intent Mandate on the AP2 protocol.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 border-t border-white/10 flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-muted-foreground hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </motion.button>

        {currentStep < steps.length ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={18} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              <>
                <Shield size={18} />
                Sign & Deploy Agent
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
