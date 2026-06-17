"use client";

import { LucideIcon, ShieldCheck, Activity, AlertTriangle, Flame, BarChart, Zap, Shield, Target, Binary, Box } from 'lucide-react';
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
  Shield,
  Target,
  Binary,
  Box
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
  const isWarning = trend.includes('IMMEDIATE') || trend.includes('CRITICAL');
  const isPositive = trend.includes('+') || trend.includes('ACTIVE');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="glass-card p-6 h-full flex flex-col justify-between relative overflow-hidden group border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className={cn(
            "p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-500 group-hover:scale-110", 
            color || "text-primary"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn(
              "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border transition-all",
              isWarning 
                ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" 
                : (isPositive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20")
            )}>
              {trend}
            </div>
          )}
        </div>
        
        <div className="space-y-1 relative z-10">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 leading-tight">{label}</h3>
          <p className="text-4xl font-headline font-bold text-white tracking-tight tabular-nums">{value}</p>
        </div>
        
        {/* Subliminal Decorative Layers */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
          <Icon className="w-24 h-24 rotate-12" />
        </div>
        
        <div className={cn(
          "absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full -mr-12 -mt-12 transition-all duration-700 opacity-10 group-hover:opacity-20",
          color?.includes('destructive') ? "bg-destructive" : "bg-primary"
        )}></div>
      </Card>
    </motion.div>
  );
}