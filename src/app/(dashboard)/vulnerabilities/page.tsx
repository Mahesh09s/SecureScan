"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertOctagon, 
  Search, 
  ChevronRight, 
  Download, 
  ShieldAlert,
  Loader2,
  Info,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Binary,
  Code2,
  FileText,
  CheckCircle2,
  Filter,
  ArrowRight,
  MoreVertical,
  Table as TableIcon,
  LayoutGrid,
  ExternalLink,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

export default function VulnerabilityInventoryPage() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [selectedVuln, setSelectedVuln] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const vulnsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, 'vulnerabilities'),
      where('ownerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, currentUser]);

  const { data: vulnerabilities, loading } = useCollection<any>(vulnsQuery);

  const filteredVulns = useMemo(() => {
    return vulnerabilities?.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.assetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           v.cve?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(v.severity);
      return matchesSearch && matchesSeverity;
    });
  }, [vulnerabilities, searchQuery, severityFilter]);

  const updateVulnStatus = async (id: string, newStatus: string) => {
    if (!firestore || !currentUser) return;
    try {
      await updateDoc(doc(firestore, 'vulnerabilities', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      toast({ title: "Status Updated", description: `Finding marked as ${newStatus}` });
      logAuditEvent(currentUser.uid, currentUser.email!, 'VULN_STATUS_CHANGE', `Updated status of ${id} to ${newStatus}`, id);
      setSelectedVuln(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  const getSeverityStyles = (sev: string) => {
    switch (sev) {
      case 'Critical': return { color: 'text-destructive', border: 'border-destructive', bg: 'bg-destructive/10', icon: Flame };
      case 'High': return { color: 'text-orange-500', border: 'border-orange-500', bg: 'bg-orange-500/10', icon: AlertTriangle };
      case 'Medium': return { color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10', icon: AlertTriangle };
      case 'Low': return { color: 'text-emerald-500', border: 'border-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 };
      default: return { color: 'text-blue-400', border: 'border-blue-400', bg: 'bg-blue-400/10', icon: Info };
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Tactical Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Vulnerability Inventory</h2>
          <p className="text-muted-foreground text-sm font-medium">Unified repository of technical findings across all authorized assets.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('table')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'table' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl h-11 px-6 gap-2">
            <Download className="w-4 h-4" /> Export Audit
          </Button>
          <Button className="cyber-gradient border-none rounded-xl h-11 px-6 font-bold text-white shadow-lg shadow-primary/20 gap-2">
            <Target className="w-4 h-4" /> Remediation Hub
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Refine Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Severity Spectrum</label>
                <div className="space-y-1.5">
                  {['Critical', 'High', 'Medium', 'Low', 'Info'].map(sev => {
                    const styles = getSeverityStyles(sev);
                    const Icon = styles.icon;
                    const isSelected = severityFilter.includes(sev);
                    return (
                      <button 
                        key={sev}
                        onClick={() => setSeverityFilter(prev => isSelected ? prev.filter(s => s !== sev) : [...prev, sev])}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border transition-all group",
                          isSelected ? "bg-white/10 border-white/20" : "bg-transparent border-transparent hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("p-1.5 rounded-lg bg-white/5", styles.color)}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className={cn("text-xs font-bold transition-colors", isSelected ? "text-white" : "text-muted-foreground group-hover:text-white")}>{sev}</span>
                        </div>
                        <div className={cn("w-1.5 h-1.5 rounded-full transition-all", isSelected ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-white/10")} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Discovery Analysis</label>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-[11px] font-bold hover:bg-white/5 text-muted-foreground hover:text-white">
                    <Binary className="w-4 h-4 text-primary" /> CVE Cross-Correlation
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-[11px] font-bold hover:bg-white/5 text-muted-foreground hover:text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Resolved Database
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-all" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary/50 text-white text-lg placeholder:text-muted-foreground/30 shadow-2xl" 
              placeholder="Filter by CVE, asset node, or technical title..." 
            />
          </div>

          {loading ? (
            <div className="p-32 text-center text-muted-foreground flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-xs font-black uppercase tracking-widest opacity-50">Decrypting Findings...</span>
            </div>
          ) : viewMode === 'table' ? (
            <Card className="glass-card overflow-hidden">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Vulnerability Title</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Severity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Asset Node</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">CVSS</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVulns?.map((v) => (
                    <TableRow key={v.id} onClick={() => setSelectedVuln(v)} className="border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5", getSeverityStyles(v.severity).color)}>
                            <AlertOctagon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{v.title}</p>
                            {v.cve && <p className="text-[10px] font-mono text-primary/60">{v.cve}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] font-black tracking-widest uppercase border-none", getSeverityStyles(v.severity).bg, getSeverityStyles(v.severity).color)}>
                          {v.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[11px] font-bold text-muted-foreground">{v.assetName}</TableCell>
                      <TableCell className="text-[11px] font-mono font-bold text-white/80">{v.cvss || '0.0'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-bold border-white/10 text-muted-foreground uppercase">{v.status || 'Active'}</Badge>
                      </TableCell>
                      <TableCell><ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!filteredVulns || filteredVulns.length === 0) && (
                <div className="p-20 text-center opacity-30 italic text-sm">Security perimeter verified clean. No active findings recorded.</div>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVulns?.map((v) => {
                const styles = getSeverityStyles(v.severity);
                return (
                  <Card key={v.id} onClick={() => setSelectedVuln(v)} className="glass-card hover:border-primary/30 transition-all cursor-pointer overflow-hidden border-l-4 border-l-primary group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge className={cn("border-none px-3 py-0.5 text-[9px] font-black uppercase tracking-widest", styles.bg, styles.color)}>
                          {v.severity}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">CVSS: {v.cvss || '0.0'}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors text-sm line-clamp-1">{v.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Asset: {v.assetName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-80">{v.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedVuln} onOpenChange={(open) => !open && setSelectedVuln(null)}>
        <DialogContent className="bg-[#020617] border-white/10 text-white max-w-3xl overflow-y-auto max-h-[90vh] scrollbar-hide perspective-1000 p-0">
          {selectedVuln && (
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-32 cyber-gradient opacity-10 pointer-events-none" />
              
              <div className="p-8 space-y-8 relative z-10">
                <DialogHeader className="space-y-4">
                  <div className="flex justify-between items-start pr-12">
                    <Badge className={cn("border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest", getSeverityStyles(selectedVuln.severity).bg, getSeverityStyles(selectedVuln.severity).color)}>
                      {selectedVuln.severity} Risk Identified
                    </Badge>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Impact Score</p>
                      <p className="text-3xl font-headline font-bold text-primary">{selectedVuln.cvss || '0.0'}</p>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl font-bold leading-tight tracking-tight text-white">{selectedVuln.title}</DialogTitle>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-bold text-white/80">Asset: {selectedVuln.assetName}</span>
                    </div>
                    {selectedVuln.cve && (
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                        <Binary className="w-4 h-4 text-primary" />
                        <span className="text-[11px] font-mono font-bold text-primary">{selectedVuln.cve}</span>
                      </div>
                    )}
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Technical Analysis
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">{selectedVuln.description}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5" /> Business Impact
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">{selectedVuln.impact}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Immediate Remediation
                  </h4>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                    <p className="text-xs leading-relaxed text-emerald-500/90 font-medium">{selectedVuln.recommendation}</p>
                  </div>
                </div>

                {selectedVuln.evidence && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Binary className="w-3.5 h-3.5" /> Telemetry Evidence
                      <Badge variant="outline" className="text-[8px] py-0 ml-auto border-white/10 opacity-40">Live Capture</Badge>
                    </h4>
                    <pre className="bg-black/60 p-5 rounded-xl text-[10px] font-mono overflow-x-auto border border-white/5 text-emerald-400/80 shadow-inner scrollbar-hide">
                      {selectedVuln.evidence}
                    </pre>
                  </div>
                )}

                <div className="pt-8 border-t border-white/10 flex gap-4">
                  <Button 
                    className="flex-1 cyber-gradient h-12 text-[13px] font-bold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    onClick={() => updateVulnStatus(selectedVuln.id, 'Resolved')}
                  >
                    Authorize Remediation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10 h-12 bg-white/5 hover:bg-white/10 text-white text-[13px] font-bold" 
                    onClick={() => window.location.href = `/ai-assistant?vulnId=${selectedVuln.id}`}
                  >
                    <Code2 className="w-4 h-4 mr-2 text-primary" />
                    AI Security Analyst
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}