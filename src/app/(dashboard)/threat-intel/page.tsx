"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ShieldAlert, 
  TrendingUp, 
  Flame, 
  Globe, 
  Filter,
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockCVEs = [
  { id: 'CVE-2024-3094', title: 'Backdoor in XZ Utils', severity: 'Critical', score: 10.0, vendor: 'Linux Foundation', status: 'Trending', date: '2024-03-29' },
  { id: 'CVE-2024-21626', title: 'runc Process.cwd Container Breakout', severity: 'High', score: 8.6, vendor: 'Docker / runc', status: 'Active', date: '2024-01-31' },
  { id: 'CVE-2023-4863', title: 'Heap buffer overflow in libwebp', severity: 'Critical', score: 9.8, vendor: 'Google / WebP', status: 'Historical', date: '2023-09-12' },
  { id: 'CVE-2024-21887', title: 'Ivanti Connect Secure Command Injection', severity: 'Critical', score: 9.1, vendor: 'Ivanti', status: 'Exploited', date: '2024-01-11' },
  { id: 'CVE-2024-3400', title: 'Palo Alto GlobalProtect Command Injection', severity: 'Critical', score: 10.0, vendor: 'Palo Alto Networks', status: 'Trending', date: '2024-04-12' },
];

export default function ThreatIntelPage() {
  const [search, setSearch] = useState("");

  const filteredCVEs = mockCVEs.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Threat Intelligence
          </h2>
          <p className="text-muted-foreground">Global vulnerability feed and high-impact trending exploits.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-white/10 gap-2 h-11">
            <Database className="w-4 h-4" />
            Connect SIEM
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical Trending', value: '14', icon: Flame, color: 'text-destructive' },
          { label: 'Active Exploits', value: '382', icon: ShieldAlert, color: 'text-orange-500' },
          { label: 'Vuln DB Sync', value: '99.9%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'New CVEs (24h)', value: '114', icon: Database, color: 'text-primary' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-3xl font-headline font-bold text-white">{stat.value}</h4>
              </div>
              <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search CVE, Vendor, or ID..." 
                className="pl-10 h-12 glass border-white/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 glass border-white/10 gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <Card className="glass-card overflow-hidden">
            <div className="divide-y divide-white/5">
              {filteredCVEs.map((cve) => (
                <div key={cve.id} className="p-6 hover:bg-white/5 transition-all group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-primary">{cve.id}</span>
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-bold",
                        cve.status === 'Trending' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {cve.status}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{cve.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                      <span>Vendor: {cve.vendor}</span>
                      <span>Published: {cve.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">CVSS Score</p>
                      <p className={cn(
                        "text-2xl font-headline font-bold",
                        cve.score >= 9 ? "text-destructive" : "text-orange-500"
                      )}>{cve.score.toFixed(1)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary/20 group-hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredCVEs.length === 0 && (
                <div className="p-20 text-center opacity-30 italic">No intelligence records match your search.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Intelligence Sources
            </h4>
            <div className="space-y-3">
              {[
                { name: 'NIST NVD', status: 'Synced', date: '2m ago' },
                { name: 'MITRE CVE', status: 'Synced', date: '10m ago' },
                { name: 'CISA KEV', status: 'Synced', date: '1h ago' },
                { name: 'AlienVault OTX', status: 'Active', date: '5m ago' },
              ].map((source) => (
                <div key={source.name} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">{source.name}</p>
                    <p className="text-[10px] text-muted-foreground">{source.date}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px]">{source.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-card border-l-4 border-l-destructive p-6">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-destructive mt-1" />
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Advisory Alert</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Multiple critical exploits targeting <strong>Ivanti Gateway</strong> have been detected in the wild. Immediate patching is recommended for all affected nodes.
                </p>
                <Button variant="link" className="text-destructive p-0 h-auto text-[10px] font-bold uppercase">View Advisory →</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}