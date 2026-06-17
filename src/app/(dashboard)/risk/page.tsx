"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, Zap, Target, Flame, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const matrixData = [
  { p: 5, i: 5, count: 2, label: 'Critical' },
  { p: 5, i: 4, count: 1, label: 'Critical' },
  { p: 4, i: 5, count: 3, label: 'Critical' },
  { p: 4, i: 4, count: 5, label: 'High' },
  { p: 3, i: 3, count: 8, label: 'Medium' },
  { p: 2, i: 2, count: 12, label: 'Low' },
  { p: 1, i: 1, count: 24, label: 'Info' },
];

export default function RiskMatrixPage() {
  const getCellColor = (p: number, i: number) => {
    const score = p * i;
    if (score >= 20) return "bg-destructive/80 hover:bg-destructive";
    if (score >= 12) return "bg-orange-500/80 hover:bg-orange-500";
    if (score >= 6) return "bg-yellow-500/80 hover:bg-yellow-500";
    if (score >= 3) return "bg-blue-500/80 hover:bg-blue-500";
    return "bg-white/5 hover:bg-white/10";
  };

  const findCount = (p: number, i: number) => {
    return matrixData.find(d => d.p === p && d.i === i)?.count || 0;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          Strategic Risk Matrix
        </h2>
        <p className="text-muted-foreground">Correlation between exploit probability and business impact.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 glass-card p-8">
          <div className="relative">
            {/* Y-Axis Label */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Impact Severity
            </div>
            
            <div className="grid grid-cols-5 gap-2 aspect-square max-w-[500px] mx-auto">
              {[5, 4, 3, 2, 1].map((impact) => (
                [1, 2, 3, 4, 5].map((prob) => {
                  const count = findCount(prob, impact);
                  return (
                    <div 
                      key={`${prob}-${impact}`}
                      className={cn(
                        "relative flex items-center justify-center rounded-xl border border-white/5 transition-all cursor-pointer group",
                        getCellColor(prob, impact)
                      )}
                    >
                      {count > 0 && (
                        <span className="text-xl font-headline font-bold text-white drop-shadow-lg">
                          {count}
                        </span>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                        <span className="text-[8px] font-bold uppercase bg-black/60 px-2 py-1 rounded">
                          P:{prob} I:{impact}
                        </span>
                      </div>
                    </div>
                  );
                })
              ))}
            </div>

            {/* X-Axis Label */}
            <div className="text-center mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Probability of Exploit
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card p-6 space-y-6">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Risk Concentration
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Critical Risk', count: 6, color: 'text-destructive', icon: Flame },
                { label: 'High Risk', count: 5, color: 'text-orange-500', icon: ShieldAlert },
                { label: 'Medium Risk', count: 8, color: 'text-yellow-500', icon: Activity },
                { label: 'Low Risk', count: 36, color: 'text-blue-500', icon: Zap },
              ].map((risk) => (
                <div key={risk.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <risk.icon className={cn("w-4 h-4", risk.color)} />
                    <span className="text-sm font-bold text-white">{risk.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-headline font-bold">{risk.count}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Mitigation Strategy</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Security resources are currently prioritized for the <strong>(5,5)</strong> and <strong>(4,5)</strong> quadrants. 14 critical findings in these sectors require immediate eradication to reduce the total risk score.
              </p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Primary Exposure</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-destructive/10 text-destructive border-none text-[9px]">SUPPLY CHAIN</Badge>
                  <Badge className="bg-primary/10 text-primary border-none text-[9px]">EDGE CONFIG</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}