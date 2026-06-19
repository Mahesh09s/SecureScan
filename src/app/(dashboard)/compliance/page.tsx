"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Activity, 
  LayoutGrid, 
  AlertCircle,
  FileBadge,
  Terminal,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  PolarAngleAxis 
} from "recharts";

const complianceData = [
  { name: 'NIST CSF', score: 68, color: '#3b82f6', icon: ShieldCheck, status: 'Active' },
  { name: 'ISO 27001', score: 45, color: '#eab308', icon: FileBadge, status: 'In Review' },
  { name: 'SOC 2 T2', score: 92, color: '#10b981', icon: Lock, status: 'Audit Ready' },
  { name: 'PCI DSS', score: 70, color: '#f97316', icon: FileText, status: 'Scanning' },
];

export default function ComplianceDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
          <FileBadge className="w-8 h-8 text-primary" />
          Compliance GRC Center
        </h2>
        <p className="text-muted-foreground">Automated mapping of scan results to global security frameworks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceData.map((item) => (
          <Card key={item.name} className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-[120px] w-[120px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  data={[{ value: item.score }]} 
                  startAngle={90} 
                  endAngle={450}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} fill={item.color} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-headline font-bold">{item.score}%</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white">{item.name}</h4>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.status}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card p-6">
            <h4 className="text-lg font-headline font-bold mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              MITRE ATT&CK® Coverage
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Initial Access', coverage: 85, techniques: 'T1190, T1566' },
                { label: 'Execution', coverage: 62, techniques: 'T1059, T1204' },
                { label: 'Persistence', coverage: 40, techniques: 'T1547, T1037' },
                { label: 'Priv Escalation', coverage: 30, techniques: 'T1548, T1068' },
                { label: 'Defense Evasion', coverage: 25, techniques: 'T1562, T1070' },
                { label: 'Credential Access', coverage: 55, techniques: 'T1110, T1003' },
                { label: 'Discovery', coverage: 70, techniques: 'T1087, T1082' },
                { label: 'Lateral Movement', coverage: 15, techniques: 'T1021, T1570' },
              ].map((t) => (
                <div key={t.label} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <p className="text-[10px] font-bold text-white/70 uppercase truncate">{t.label}</p>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-headline font-bold text-white">{t.coverage}%</span>
                  </div>
                  <Progress value={t.coverage} className="h-1 bg-white/5" />
                  <p className="text-[8px] text-muted-foreground truncate">{t.techniques}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h4 className="text-lg font-headline font-bold mb-6 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              OWASP Top 10 (2021) Mapping
            </h4>
            <div className="space-y-4">
              {[
                { id: 'A01', name: 'Broken Access Control', risk: 'High', assets: 4 },
                { id: 'A03', name: 'Injection', risk: 'Critical', assets: 2 },
                { id: 'A05', name: 'Security Misconfiguration', risk: 'Medium', assets: 18 },
                { id: 'A06', name: 'Vulnerable Components', risk: 'High', assets: 7 },
              ].map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-headline font-bold text-primary">
                      {o.id}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">{o.name}</h5>
                      <p className="text-[10px] text-muted-foreground">{o.assets} assets affected</p>
                    </div>
                  </div>
                  <Badge variant={o.risk === 'Critical' ? 'destructive' : 'secondary'} className="text-[9px]">
                    {o.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card p-6 space-y-6">
            <h4 className="text-sm font-bold text-white">Compliance Alerts</h4>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest">NIST SP 800-53</p>
                  <p className="text-xs text-muted-foreground">Control AC-2 (Account Management) violation detected on <strong>Prod-Web-01</strong>.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest">CIS Control v8</p>
                  <p className="text-xs text-muted-foreground">IG1 Recommendation 3.1: Data assets not inventoried.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h4 className="text-sm font-bold text-white mb-4">Infrastructure Context</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <Server className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold">14</p>
                <p className="text-[8px] text-muted-foreground uppercase font-bold">Scoped Nodes</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold">88%</p>
                <p className="text-[8px] text-muted-foreground uppercase font-bold">Uptime Avg</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}