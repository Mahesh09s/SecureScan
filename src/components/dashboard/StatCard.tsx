"use client";

import { LucideIcon, ShieldCheck, Activity, AlertTriangle, Flame, BarChart, Zap, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Flame,
  BarChart,
  Zap,
  Shield
};

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: string;
  color?: string;
}

export function StatCard({ label, value, trend, icon, color }: StatCardProps) {
  const Icon = iconMap[icon] || ShieldCheck;
  const isPositive = trend.startsWith('+');
  const isWarning = trend === 'IMMEDIATE' || trend === 'CRITICAL';
  const isOptimal = trend === 'OPTIMAL' || trend === 'ACTIVE';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="cyber-card p-8 relative overflow-hidden group border-white/5 bg-white/[0.02] h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-8">
          <div className={cn(
            "p-4 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-all duration-500 shadow-xl", 
            color || "text-primary"
          )}>
            <Icon className="w-7 h-7" />
          </div>
          {trend && (
            <div className={cn(
              "text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border shadow-sm transition-all",
              isOptimal 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : (isWarning ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" : "bg-primary/10 text-primary border-primary/20")
            )}>
              {trend}
            </div>
          )}
        </div>
        
        <div className="space-y-1 relative z-10">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-1 opacity-60">{label}</h3>
          <p className="text-4xl font-headline font-bold text-white tracking-tighter tabular-nums">{value}</p>
        </div>
        
        {/* Elite Decorative Layers */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
          <Icon className="w-32 h-32 rotate-12" />
        </div>
        
        {/* Dynamic Glow */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 transition-all duration-700 opacity-20 group-hover:opacity-40",
          color?.includes('destructive') ? "bg-destructive" : "bg-primary"
        )}></div>

        {/* Scan-line Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-[1.5s] ease-linear" />
      </Card>
    </motion.div>
  );
}