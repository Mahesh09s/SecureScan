
"use client";

import { useMemo } from 'react';
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
  Area
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, ShieldCheck, Zap, Lock, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';

const scanHistory = [
  { name: 'Jan', scans: 45, risks: 12 },
  { name: 'Feb', scans: 52, risks: 18 },
  { name: 'Mar', scans: 48, risks: 15 },
  { name: 'Apr', scans: 61, risks: 10 },
  { name: 'May', scans: 55, risks: 8 },
  { name: 'Jun', scans: 67, risks: 21 },
];

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
    return query(collection(firestore, 'scans'), where('ownerId', '==', currentUser.uid));
  }, [firestore, currentUser]);

  const auditQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'auditLogs'), where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc'), limit(10));
  }, [firestore, currentUser]);

  const { data: vulnerabilities } = useCollection<any>(vulnsQuery);
  const { data: assets } = useCollection<any>(assetsQuery);
  const { data: scans } = useCollection<any>(scansQuery);
  const { data: recentActivity } = useCollection<any>(auditQuery);

  const stats = useMemo(() => {
    const criticals = vulnerabilities?.filter(v => v.severity === 'Critical').length || 0;
    const highs = vulnerabilities?.filter(v => v.severity === 'High').length || 0;
    const assetsCount = assets?.length || 0;
    const scansCount = scans?.length || 0;
    
    const baseScore = 100;
    const reduction = (criticals * 10) + (highs * 5);
    const score = Math.max(0, baseScore - reduction);

    return [
      { label: 'Total Assets', value: assetsCount.toString(), trend: '+2', icon: 'ShieldCheck' },
      { label: 'Total Scans', value: scansCount.toString(), trend: '+5', icon: 'Activity' },
      { label: 'Critical Issues', value: criticals.toString(), trend: criticals > 0 ? 'Action Required' : 'Clean', icon: 'AlertTriangle', color: criticals > 0 ? 'text-destructive' : 'text-emerald-500' },
      { label: 'High Risks', value: highs.toString(), trend: highs.toString(), icon: 'Flame', color: highs > 0 ? 'text-orange-500' : 'text-muted-foreground' },
      { label: 'Risk Score', value: `${score}/100`, trend: score > 80 ? 'Good' : 'Needs Attention', icon: 'BarChart' },
    ];
  }, [vulnerabilities, assets, scans]);

  const severityData = useMemo(() => {
    return [
      { name: 'Critical', value: vulnerabilities?.filter(v => v.severity === 'Critical').length || 0, fill: 'hsl(var(--destructive))' },
      { name: 'High', value: vulnerabilities?.filter(v => v.severity === 'High').length || 0, fill: '#f97316' },
      { name: 'Medium', value: vulnerabilities?.filter(v => v.severity === 'Medium').length || 0, fill: '#eab308' },
      { name: 'Low', value: vulnerabilities?.filter(v => v.severity === 'Low').length || 0, fill: '#3b82f6' },
    ];
  }, [vulnerabilities]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-headline font-bold text-white text-glow">Security Overview</h2>
        <p className="text-muted-foreground">Welcome back, {currentUser?.displayName || 'analyst'}. Here's your surface threat analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Scan History & Risk Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanHistory}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
                <Area type="monotone" dataKey="risks" stroke="#f97316" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              Vulnerability Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={60} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Security Activity Timeline
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal">Audit Ready</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.map((log: any) => (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group relative">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                    {log.action.includes('LOGIN') ? <Lock className="w-4 h-4 text-emerald-500" /> : 
                     log.action.includes('SCAN') ? <Zap className="w-4 h-4 text-primary" /> : 
                     <ShieldCheck className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-white">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground">{log.timestamp?.toDate().toLocaleTimeString()}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{log.details}</p>
                  </div>
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <div className="text-center py-10 text-muted-foreground text-sm">No recent activity detected.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Compliance Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {[
                { name: 'SOC 2 Type II', status: 'Compliant', progress: 100 },
                { name: 'ISO 27001', status: 'In Review', progress: 85 },
                { name: 'GDPR Compliance', status: 'Action Required', progress: 42 },
                { name: 'PCI-DSS', status: 'Compliant', progress: 100 },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">{item.name}</span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      item.status === 'Compliant' ? "text-emerald-500" : item.status === 'In Review' ? "text-primary" : "text-destructive"
                    )}>{item.status}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        item.status === 'Compliant' ? "bg-emerald-500" : item.status === 'In Review' ? "bg-primary" : "bg-destructive"
                      )} 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
