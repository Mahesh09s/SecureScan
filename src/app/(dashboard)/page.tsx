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
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  Globe, 
  Activity, 
  TrendingUp,
  Flame,
  Zap,
  Clock,
  CheckCircle2,
  Lock,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  Target,
  FileSearch,
  AlertTriangle
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
    <div className="space-y-10 max-w-[1700px] mx-auto pb-20">
      {/* Strategic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              Operational Status: Active
            </Badge>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <h2 className="text-5xl font-headline font-bold text-white tracking-tight flex items-center gap-4">
            Command Center
          </h2>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl">
            Global security perimeter monitoring and real-time threat analysis engine.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="cyber-card px-6 py-4 flex items-center gap-5 border-l-4 border-l-primary">
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Live Engines</p>
              <p className="text-2xl font-headline font-bold text-white">14 Nodes</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Layer */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <Card className="cyber-card flex flex-col items-center justify-center p-10 space-y-8 bg-white/[0.02] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 cyber-gradient opacity-30" />
          <SecurityGauge score={securityScore} />
          <div className="text-center space-y-1.5 relative z-10">
            <h4 className="text-xl font-bold text-white font-headline">Perimeter Integrity</h4>
            <p className="text-sm text-muted-foreground">Analyzing {vulnerabilities?.length || 0} active findings</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full relative z-10">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center hover:bg-white/10 transition-colors">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Risk Exposure</p>
              <p className="text-3xl font-headline font-bold text-white">{100 - securityScore}%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center hover:bg-white/10 transition-colors">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">SLA Health</p>
              <p className="text-3xl font-headline font-bold text-emerald-500">99.9%</p>
            </div>
          </div>
        </Card>

        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Total Surface" value={assets?.length.toString() || "0"} trend="+4 Assets" icon="ShieldCheck" />
          <StatCard label="Critical Risk" value={vulnerabilities?.filter(v => v.severity === 'Critical').length.toString() || "0"} trend="IMMEDIATE" icon="Flame" color="text-destructive" />
          <StatCard label="Scan Throughput" value="2.8 GB/s" trend="OPTIMAL" icon="Zap" color="text-primary" />
          
          <Card className="md:col-span-2 lg:col-span-3 cyber-card p-8 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Global Risk Exposure (7D Trend)
                </h4>
                <p className="text-xs text-muted-foreground font-medium">Monitoring exploit probability across all mapped clusters.</p>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-white/10 px-4 py-1">LIVE TELEMETRY</Badge>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}
                    itemStyle={{ color: 'white', fontWeight: 'bold' }}
                    labelStyle={{ color: 'gray', fontSize: '12px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRisk)" />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} strokeDasharray="10 10" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Secondary Insights Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <Card className="cyber-card p-0 overflow-hidden bg-white/[0.02]">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-lg font-headline flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              Compliance Roadmaps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {[
              { name: 'SOC 2 Type II (Continuous)', status: 'Audit Ready', progress: 95, color: 'text-emerald-500' },
              { name: 'NIST CSF v2.0 Mapping', status: 'Remediation', progress: 68, color: 'text-primary' },
              { name: 'ISO 27001:2022', status: 'In Review', progress: 82, color: 'text-blue-500' },
              { name: 'PCI DSS v4.0 Scopes', status: 'Scanning', progress: 45, color: 'text-yellow-500' },
            ].map((item) => (
              <div key={item.name} className="space-y-3 group cursor-pointer">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.name}</p>
                    <p className={cn("text-[10px] uppercase font-bold tracking-widest", item.color)}>{item.status}</p>
                  </div>
                  <span className="text-sm font-headline font-bold text-white">{item.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${item.progress}%` }} 
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn("h-full rounded-full", item.progress === 100 ? "bg-emerald-500" : "bg-primary")} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="cyber-card xl:col-span-2 overflow-hidden bg-white/[0.02]">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              Infrastructure Health Distribution
            </CardTitle>
            <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px]">Global Coverage</Badge>
          </CardHeader>
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-around h-[380px] gap-10">
            <div className="grid grid-cols-2 gap-8 w-full max-w-xl">
              {[
                { label: 'Healthy', val: assets?.filter(a => a.status === 'Healthy').length || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Vulnerable', val: assets?.filter(a => a.status === 'Vulnerable').length || 0, icon: ShieldAlert, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { label: 'Scanning', val: assets?.filter(a => a.status === 'Scanning').length || 0, icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'High Risk', val: vulnerabilities?.filter(v => v.severity === 'Critical').length || 0, icon: Flame, color: 'text-destructive', bg: 'bg-destructive/10' },
              ].map((item) => (
                <motion.div 
                  key={item.label} 
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-3 text-center"
                >
                  <div className={cn("p-4 rounded-2xl shadow-lg", item.bg, item.color)}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-headline font-bold text-white">{item.val}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="hidden xl:block h-full w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            
            <div className="hidden xl:flex flex-col gap-6 text-sm">
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Risk Assessment</p>
                <p className="text-white font-medium leading-relaxed">
                  Perimeter is currently <span className="text-primary font-bold">Stable</span>. Primary exposure concentrated in <span className="text-destructive font-bold">Web API</span> cluster. 
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Intelligence</p>
                <p className="text-white/70 italic text-xs leading-relaxed">
                  "CVE-2024-3094 trending in external feeds. Scanning active nodes for binary match..."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Findings Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="cyber-card bg-white/[0.02]">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              Strategic Audit Log
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-primary/10">View All Actions</Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">SCAN_COMPLETE_BASELINE</p>
                    <p className="text-[10px] text-muted-foreground font-medium">14:22:01</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">Automated baseline assessment completed on production cluster alpha. 0 new issues.</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="cyber-card bg-white/[0.02]">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline flex items-center gap-3 text-glow-destructive">
              <Flame className="w-6 h-6 text-destructive" />
              Critical Findings Queue
            </CardTitle>
            <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] px-3 py-1">PRIORITY 1</Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {vulnerabilities?.filter(v => v.severity === 'Critical' || v.severity === 'High').slice(0, 4).map((v: any) => (
              <div 
                key={v.id} 
                className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-destructive/30 transition-all cursor-pointer group" 
                onClick={() => window.location.href='/vulnerabilities'}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  v.severity === 'Critical' ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-500"
                )}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-bold text-white truncate group-hover:text-destructive transition-colors">{v.title}</p>
                    {v.cve && <Badge variant="secondary" className="text-[9px] bg-white/10 text-primary/80 uppercase font-mono px-2">{v.cve}</Badge>}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Asset: <span className="text-white/80">{v.assetName}</span> • CVSS: <span className={v.severity === 'Critical' ? "text-destructive" : "text-orange-500"}>{v.cvss || '9.8'}</span>
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transform group-hover:translate-x-1 transition-all" />
              </div>
            ))}
            {(!vulnerabilities || vulnerabilities.filter(v => v.severity === 'Critical' || v.severity === 'High').length === 0) && (
              <div className="p-20 text-center flex flex-col items-center gap-6 opacity-30">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase">Perimeter Sanitized</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}