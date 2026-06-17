import { LucideIcon, ShieldCheck, Activity, AlertTriangle, Flame, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  const isNeutral = !trend.includes('%') && !isPositive;

  return (
    <Card className="glass-card p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          isNeutral ? "bg-white/5 text-white/70" : (isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive")
        )}>
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
        <p className="text-2xl font-headline font-bold text-white">{value}</p>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mb-12 group-hover:bg-primary/10 transition-all"></div>
    </Card>
  );
}