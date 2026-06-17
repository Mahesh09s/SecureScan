
"use client";

import { useMemo, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ShieldAlert, 
  Globe, 
  Activity, 
  TrendingUp,
  Flame,
  Target,
  FileSearch,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';

const scanHistory = [
  { name: 'Jan', scans: 45, risks: 12 },
  { name: 'Feb', scans: 52, risks: 18 },
  { name: 'Mar', scans: 48, risks: 15 },
  { name: 'Apr', scans: 61, risks: 10 },
  { name: 'May', scans: 55, risks: 8 },
  { name: 'Jun', scans: 67, risks: 21 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

export default function Dashboard() {
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
    return query(collection(firestore, 'auditLogs'), where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc'), limit(6));
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
    return Math.max(0, baseScore - reduction);
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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
            Security Command Center
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[10px] py-1">Enterprise Active</Badge>
          </h2>
          <p className="text-muted-foreground">Global threat posture and asset health monitoring.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 glass">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Security Score</p>
            <p className={cn(
              "text-3xl font-headline font-bold",
              securityScore > 80 ? "text-emerald-500" : securityScore > 50 ? "text-yellow-500" : "text-destructive"
            )}>
              {securityScore}<span className="text-sm text-muted-foreground/50">/100</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <TrendingUp className={cn("w-6 h-6", securityScore > 80 ? "text-emerald-500" : "text-yellow-500")} />
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard label="Total Assets" value={assets?.length.toString() || "0"} trend="+2" icon="ShieldCheck" />
        <StatCard label="Critical Issues" value={vulnerabilities?.filter(v => v.severity === 'Critical').length.toString() || "0"} trend="Action Required" icon="Flame" color="text-destructive" />
        <StatCard label="Total Scans" value="1.2k" trend="+12%" icon="Activity" />
        <StatCard label="Uptime" value="99.9%" trend="Stable" icon="BarChart" />
        <StatCard label="MTTR" value="4.2d" trend="-1.5d" icon="Activity" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* World Map & Asset Distribution */}
        <Card className="xl:col-span-2 glass-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-headline font-bold">Global Asset Perimeter</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest">Live Heatmap</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative h-[400px] flex items-center justify-center bg-black/20">
            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20 pointer-events-none absolute">
              <path d="M150,200 Q200,150 250,200 T350,200 T450,200 T550,200 T650,200 T750,200 T850,200" stroke="white" fill="none" />
              {/* Simulated continents/nodes */}
              <circle cx="200" cy="180" r="40" fill="currentColor" className="text-white/20" />
              <circle cx="500" cy="250" r="60" fill="currentColor" className="text-white/20" />
              <circle cx="800" cy="200" r="30" fill="currentColor" className="text-white/20" />
            </svg>
            <div className="z-10 text-center space-y-4 px-10">
              <div className="grid grid-cols-3 gap-12">
                <div className="space-y-1">
                  <p className="text-3xl font-headline font-bold text-white">42</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">North America</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline font-bold text-white">18</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Europe</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline font-bold text-white">12</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">APAC</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">Asset clusters identified across multiple geo-redundant nodes. All endpoints are currently responding within latency thresholds.</p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Breakdown */}
        <Card className="glass-card flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              Severity Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-8">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData.length > 0 ? severityData : [{ name: 'None', value: 1 }]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    {severityData.length === 0 && <Cell fill="rgba(255,255,255,0.05)" />}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                    itemStyle={{ color: 'white', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Critical', 'High', 'Medium', 'Low'].map((sev, i) => (
                <div key={sev} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] font-bold text-white/70 uppercase">{sev}</span>
                  <span className="ml-auto text-xs font-bold">{vulnerabilities?.filter(v => v.severity === sev).length || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Compliance Roadmap */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Compliance Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: 'SOC 2 Type II', status: 'Compliant', progress: 100, color: 'text-emerald-500' },
              { name: 'ISO 27001', status: 'Audit Ready', progress: 85, color: 'text-primary' },
              { name: 'GDPR Article 32', status: 'Remediation', progress: 45, color: 'text-yellow-500' },
              { name: 'PCI-DSS v4.0', status: 'Scanning', progress: 70, color: 'text-primary' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className={cn("text-[9px] uppercase font-bold", item.color)}>{item.status}</p>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    className={cn(
                      "h-full rounded-full",
                      item.progress === 100 ? "bg-emerald-500" : "bg-primary"
                    )}
                  ></motion.div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Framework Summaries */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Framework Mapping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-white">MITRE ATT&CK® Coverage</p>
                <Badge variant="outline" className="text-[8px]">T1059 / T1190</Badge>
              </div>
              <div className="flex gap-1 h-2">
                {[1, 1, 1, 1, 0, 0, 0, 0, 0, 0].map((v, i) => (
                  <div key={i} className={cn("flex-1 rounded-full", v ? "bg-primary" : "bg-white/10")}></div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">Detection coverage for initial access and execution tactics is at 40%.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-white">OWASP Top 10 (2021)</p>
                <Badge variant="outline" className="text-[8px]">A01 / A05</Badge>
              </div>
              <div className="flex gap-1 h-2">
                {[1, 1, 1, 1, 1, 1, 0, 0, 0, 0].map((v, i) => (
                  <div key={i} className={cn("flex-1 rounded-full", v ? "bg-emerald-500" : "bg-white/10")}></div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">60% of common web vulnerabilities have been actively mitigated.</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Scan Queue */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Live Scan Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {recentScans?.map((scan: any) => (
                <div key={scan.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    scan.status === 'In Progress' ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-emerald-500"
                  )}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{scan.target}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{scan.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white">{scan.progress}%</p>
                    <p className="text-[9px] text-muted-foreground">{scan.status}</p>
                  </div>
                </div>
              ))}
              {(!recentScans || recentScans.length === 0) && (
                <div className="p-10 text-center text-muted-foreground text-xs italic">No scans currently in queue.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Timeline */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Event Timeline
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-bold">Audit Stream</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.map((log: any) => (
                <div key={log.id} className="flex gap-4 relative group">
                  <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/5 group-last:hidden"></div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors z-10">
                    {log.action.includes('LOGIN') ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <ShieldAlert className="w-3 h-3 text-primary" />}
                  </div>
                  <div className="flex-1 pb-4 border-b border-white/5 group-last:border-none">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-white">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground">{log.timestamp?.toDate().toLocaleTimeString()}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Vulnerabilities / CVEs */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              High Risk Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vulnerabilities?.filter(v => v.severity === 'Critical' || v.severity === 'High').slice(0, 4).map((v: any) => (
              <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-destructive/30 transition-all cursor-pointer group" onClick={() => window.location.href = `/vulnerabilities`}>
                <div className={cn(
                  "p-3 rounded-xl flex items-center justify-center",
                  v.severity === 'Critical' ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-500"
                )}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate group-hover:text-destructive transition-colors">{v.title}</p>
                    {v.cve && <Badge variant="secondary" className="text-[8px] bg-white/10">{v.cve}</Badge>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Asset: {v.assetName} • Found: {v.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">CVSS {v.cvss || "N/A"}</p>
                </div>
              </div>
            ))}
            {(!vulnerabilities || vulnerabilities.filter(v => v.severity === 'Critical' || v.severity === 'High').length === 0) && (
              <div className="p-10 text-center flex flex-col items-center gap-4 opacity-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <p className="text-sm">No high risk vulnerabilities currently detected.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
