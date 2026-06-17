"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SecurityGaugeProps {
  score: number;
  className?: string;
}

export function SecurityGauge({ score, className }: SecurityGaugeProps) {
  // Score mapping: 0-100 to A+-F
  const getGrade = (s: number) => {
    if (s >= 95) return { label: "A+", color: "text-emerald-500", glow: "shadow-emerald-500/20" };
    if (s >= 90) return { label: "A", color: "text-emerald-400", glow: "shadow-emerald-400/20" };
    if (s >= 80) return { label: "B", color: "text-blue-400", glow: "shadow-blue-400/20" };
    if (s >= 70) return { label: "C", color: "text-yellow-400", glow: "shadow-yellow-400/20" };
    if (s >= 60) return { label: "D", color: "text-orange-500", glow: "shadow-orange-500/20" };
    return { label: "F", color: "text-destructive", glow: "shadow-destructive/20" };
  };

  const grade = getGrade(score);
  const strokeDashoffset = 100 - score;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-48 h-48 -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="80"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="80"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray="502.4"
          initial={{ strokeDashoffset: 502.4 }}
          animate={{ strokeDashoffset: 502.4 - (502.4 * score) / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={cn("transition-colors", grade.color)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("text-6xl font-headline font-bold", grade.color)}
        >
          {grade.label}
        </motion.span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">
          Health Index
        </span>
      </div>
    </div>
  );
}