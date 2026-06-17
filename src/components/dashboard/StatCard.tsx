
"use client";

import { LucideIcon, ShieldCheck, Activity, AlertTriangle, Flame, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Flame,
  BarChart,
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
  const isNeutral = !trend.includes('%') && !isPositive && !trend.includes('/');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="glass-card p-6 relative overflow-hidden group border-white/5 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-all duration-300", 
            color || "text-primary"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn(
              "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border",
              isNeutral 
                ? "bg-white/5 text-white/50 border-white/10" 
                : (isPositive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20")
            )}>
              {trend}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</h3>
          <p className="text-3xl font-headline font-bold text-white tracking-tight">{value}</p>
        </div>
        
        {/* Decorative pattern */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Icon className="w-24 h-24 rotate-12" />
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-all"></div>
      </Card>
    </motion.div>
  );
}
