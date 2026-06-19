"use client";

import { useMemo } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SecurityGauge } from '@/components/dashboard/SecurityGauge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  Activity, 
  TrendingUp,
  Flame,
  Zap,
  Clock,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Binary,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';

const trendData = [
  { name: 'Mon', risk: 45, score: 88 },
  { name: 'Tue', risk: 52, score: 85 },
  { name: 'Wed', risk: 38, score: 90 },
  { name: 'Thu', risk: 42, score: 87 },
  { name: 'Fri', risk: 30, score: 92 },
  { name: 'Sat', risk: 25, score: 95 },
  { name: 'Sun', risk: 28, score: 94 },
];

export default function ExecutiveDashboard() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();

  const vulnsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'vulnerabilities'), where('ownerId', '==', currentUser.uid));
  }, [firestore, currentUser]);

  const assetsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'assets'), where('ownerId', '==', currentUser.uid));
  }, [firestore, currentUser]);

  const scansQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'scans'), where('ownerId', '==', currentUser.uid), orderBy('startedAt', 'desc'), limit(5));
  }, [firestore, currentUser]);

  const { data: vulnerabilities } = useCollection<any>(vulnsQuery);
  const { data: assets } = useCollection<any>(assetsQuery);

  const securityScore = useMemo(() => {
    const criticals = vulnerabilities?.filter(v => v.severity === 'Critical').length || 0;
    const highs = vulnerabilities?.filter(v => v.severity === 'High').length || 0;
    const baseScore = 100;
    const reduction = (criticals * 15) + (highs * 7);
    return Math.max(10, baseScore - reduction);
  }, [vulnerabilities]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Tactical Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-3 py-0.5 text-[10px] font-black tracking-widest uppercase">
              Operational Mode: Passive Monitoring
            </Badge>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Executive Command</h2>
          <p className="text-muted-foreground text-sm font-medium">Unified real-time security posture and threat intelligence feed.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-11 px-6 gap-2">
            <Clock className="w-4 h-4" /> 24H Overview
          </Button>
          <Button className="cyber-gradient border-none rounded-xl h-11 px-6 font-bold text-white shadow-lg shadow-primary/20 gap-2">
            <Zap className="w-4 h-4" /> Run Global Audit
          </Button>
        </div>
      </div>

      {/* Strategic Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card flex flex-col items-center justify-center p-8 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 cyber-gradient opacity-50" />
          <SecurityGauge score={securityScore} className="w-40 h-48" />
          <div className="text-center space-y-1">
            <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Perimeter Integrity</h4>
            <p className="text-xs text-emerald-500 font-bold">Stable Trend: +0.4%</p>
          </div>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Digital Surface" value={assets?.length.toString() || "0"} trend="Active Assets" icon="ShieldCheck" />
          <StatCard label="Critical Risks" value={vulnerabilities?.filter(v => v.severity === 'Critical').length.toString() || "0"} trend="IMMEDIATE ACTION" icon="Flame" color="text-destructive" />
          <StatCard label="Total Findings" value={vulnerabilities?.length.toString() || "0"} trend="TELEMETRY SYNCED" icon="AlertTriangle" color="text-yellow-500" />
          
          <Card className="sm:col-span-2 lg:col-span-3 glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Risk Exposure History
                </h4>
                <p className="text-xs text-muted-foreground">Exploit probability correlated with mean-time-to-repair (MTTR).</p>
              </div>
              <Badge variant="outline" className="text-[9px] font-black border-white/10 px-3">7-DAY SCAN CYCLE</Badge>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Posture */}
        <Card className="glass-card">
          <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Compliance Roadmap
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {[
              { name: 'SOC 2 Type II', status: 'Audit Ready', progress: 95, color: 'text-emerald-500' },
              { name: 'NIST CSF v2.0', status: 'In Remediation', progress: 68, color: 'text-primary' },
              { name: 'PCI DSS v4.0', status: 'Scanning', progress: 42, color: 'text-orange-500' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className={cn("text-[9px] font-black uppercase tracking-widest", item.color)}>{item.status}</p>
                  </div>
                  <span className="text-xs font-bold text-white">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${item.progress}%` }} 
                    className={cn("h-full", item.progress > 80 ? "bg-emerald-500" : "bg-primary")} 
                  />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 text-muted-foreground hover:text-white pt-4">
              View Detailed Frameworks
            </Button>
          </CardContent>
        </Card>

        {/* Intelligence Feed */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Binary className="w-4 h-4 text-primary" />
              Intelligence Telemetry
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] px-2">LIVE SYNC</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {vulnerabilities?.filter(v => v.severity === 'Critical' || v.severity === 'High').slice(0, 4).map((v: any) => (
                <div key={v.id} className="p-5 flex items-center gap-5 hover:bg-white/[0.02] transition-all cursor-pointer group">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5",
                    v.severity === 'Critical' ? "bg-destructive/10 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "bg-orange-500/10 text-orange-500"
                  )}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{v.title}</p>
                      {v.cve && <span className="text-[9px] font-mono text-primary/60">{v.cve}</span>}
                    </div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                      Asset: <span className="text-white/60">{v.assetName}</span> • CVSS: <span className="text-white/60">{v.cvss || 'N/A'}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
            {(!vulnerabilities || vulnerabilities.length === 0) && (
              <div className="p-20 text-center text-muted-foreground text-xs italic">No telemetry data recorded in current cycle.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
