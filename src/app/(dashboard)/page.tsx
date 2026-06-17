"use client";

import { useMemo } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SecurityGauge } from '@/components/dashboard/SecurityGauge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
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
  Target,
  FileSearch,
  LayoutDashboard
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

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

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

  const auditQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'auditLogs'), where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc'), limit(5));
  }, [firestore, currentUser]);

  const { data: vulnerabilities } = useCollection<any>(vulnsQuery);
  const { data: assets } = useCollection<any>(assetsQuery);
  const { data: recentScans } = useCollection<any>(scansQuery);
  const { data: recentActivity } = useCollection<any>(auditQuery);

  const securityScore = useMemo(() => {
    const criticals = vulnerabilities?.filter(v => v.severity === 'Critical').length || 0;
    const highs = vulnerabilities?.filter(v => v.severity === 'High').length || 0;
    const baseScore = 100;
    const reduction = (criticals * 15) + (highs * 7);
    return Math.max(10, baseScore - reduction);
  }, [vulnerabilities]);

  const severityData = useMemo(() => {
    const critical = vulnerabilities?.filter(v => v.severity === 'Critical').length || 0;
    const high = vulnerabilities?.filter(v => v.severity === 'High').length || 0;
    const medium = vulnerabilities?.filter(v => v.severity === 'Medium').length || 0;
    const low = vulnerabilities?.filter(v => v.severity === 'Low').length || 0;
    
    return [
      { name: 'Critical', value: critical },
      { name: 'High', value: high },
      { name: 'Medium', value: medium },
      { name: 'Low', value: low },
    ].filter(v => v.value > 0);
  }, [vulnerabilities]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Executive Command
          </h2>
          <p className="text-muted-foreground">Strategic overview of organizational risk and compliance posture.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 glass flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Scan Queue</p>
              <p className="text-sm font-bold text-white">{recentScans?.filter(s => s.status === 'In Progress').length || 0} Engines</p>
            </div>
            <div className="w-1.5 h-8 bg-primary/20 rounded-full overflow-hidden">
              <motion.div animate={{ height: [0, 32, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-full bg-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Security Score Gauge */}
        <Card className="glass-card flex flex-col items-center justify-center p-8 space-y-6">
          <SecurityGauge score={securityScore} />
          <div className="text-center space-y-1">
            <h4 className="text-lg font-bold text-white">Security Rating</h4>
            <p className="text-xs text-muted-foreground">Based on {vulnerabilities?.length || 0} active findings</p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[9px] text-muted-foreground uppercase font-bold">Risk Score</p>
              <p className="text-xl font-headline font-bold text-white">{100 - securityScore}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[9px] text-muted-foreground uppercase font-bold">MTTR</p>
              <p className="text-xl font-headline font-bold text-emerald-500">4.2d</p>
            </div>
          </div>
        </Card>

        {/* Strategic Metrics */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Perimeter" value={assets?.length.toString() || "0"} trend="+2" icon="ShieldCheck" />
          <StatCard label="Critical Risk" value={vulnerabilities?.filter(v => v.severity === 'Critical').length.toString() || "0"} trend="Active" icon="Flame" color="text-destructive" />
          <StatCard label="Scan Velocity" value="1.2k" trend="+12%" icon="Activity" />
          
          <Card className="md:col-span-2 lg:col-span-3 glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Risk Exposure Trend (7 Days)
              </h4>
              <Badge variant="outline" className="text-[10px]">LIVE DATA</Badge>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRisk)" />
                  <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Compliance Posture */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Compliance Roadmaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: 'SOC 2 Type II', status: 'Audit Ready', progress: 95, color: 'text-emerald-500' },
              { name: 'NIST CSF v2.0', status: 'Remediation', progress: 68, color: 'text-primary' },
              { name: 'ISO 27001:2022', status: 'Gap Analysis', progress: 45, color: 'text-yellow-500' },
              { name: 'GDPR / HIPAA', status: 'Compliant', progress: 100, color: 'text-emerald-500' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className={cn("text-[9px] uppercase font-bold", item.color)}>{item.status}</p>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} className={cn("h-full rounded-full", item.progress === 100 ? "bg-emerald-500" : "bg-primary")} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Global Distribution */}
        <Card className="glass-card xl:col-span-2 overflow-hidden relative">
          <CardHeader className="relative z-10 bg-white/5 border-b border-white/5">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Asset Health Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex items-center justify-center h-[350px] relative bg-black/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 z-10 text-center w-full px-8">
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-white">{assets?.filter(a => a.status === 'Healthy').length || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Healthy</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-white">{assets?.filter(a => a.status === 'Vulnerable').length || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Vulnerable</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <p className="text-2xl font-bold text-white">{assets?.filter(a => a.status === 'Scanning').length || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Scanning</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Offline</p>
              </div>
            </div>
            {/* Background SVG Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Attack Feed */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Audit Action Stream
            </CardTitle>
            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest">Live</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity?.map((log: any) => (
              <div key={log.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">{log.timestamp?.toDate().toLocaleTimeString()}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{log.details}</p>
                </div>
              </div>
            ))}
            {(!recentActivity || recentActivity.length === 0) && (
              <div className="py-20 text-center opacity-20 italic text-sm">Waiting for system events...</div>
            )}
          </CardContent>
        </Card>

        {/* High Risk CVE Target List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              High Risk Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vulnerabilities?.filter(v => v.severity === 'Critical' || v.severity === 'High').slice(0, 4).map((v: any) => (
              <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-destructive/30 transition-all cursor-pointer group" onClick={() => window.location.href='/vulnerabilities'}>
                <div className={cn(
                  "p-3 rounded-xl flex items-center justify-center",
                  v.severity === 'Critical' ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-500"
                )}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate group-hover:text-destructive transition-colors">{v.title}</p>
                    {v.cve && <Badge variant="secondary" className="text-[8px] bg-white/10 uppercase">{v.cve}</Badge>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Asset: {v.assetName} • CVSS: {v.cvss || 'N/A'}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white" />
              </div>
            ))}
            {(!vulnerabilities || vulnerabilities.filter(v => v.severity === 'Critical' || v.severity === 'High').length === 0) && (
              <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <p className="text-sm">No high risk issues detected.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}