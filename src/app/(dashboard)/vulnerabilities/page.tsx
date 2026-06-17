"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  ChevronDown,
  LayoutGrid,
  FileText,
  Binary,
  Code2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

export default function VulnerabilitiesPage() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [selectedVuln, setSelectedVuln] = useState<any>(null);

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

  const toggleSeverity = (sev: string) => {
    setSeverityFilter(prev => 
      prev.includes(sev) ? prev.filter(s => s !== sev) : [...prev, sev]
    );
  };

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white text-glow">Vulnerability Inventory</h2>
          <p className="text-muted-foreground">Comprehensive database of all detected security findings and exposures.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 rounded-xl gap-2 hover:bg-white/5 text-white">
            <Download className="w-4 h-4" />
            Export Audit CSV
          </Button>
          <Button className="cyber-gradient border-none shadow-lg rounded-xl gap-2">
            <ShieldAlert className="w-4 h-4" />
            Remediation Hub
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Severity Filter</label>
                <div className="space-y-2">
                  {[
                    { id: 'Critical', color: 'text-destructive', icon: Flame },
                    { id: 'High', color: 'text-orange-500', icon: AlertTriangle },
                    { id: 'Medium', color: 'text-yellow-500', icon: AlertTriangle },
                    { id: 'Low', color: 'text-blue-500', icon: Info },
                  ].map(sev => (
                    <button 
                      key={sev.id}
                      onClick={() => toggleSeverity(sev.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all group",
                        severityFilter.includes(sev.id) 
                          ? "bg-white/10 border-white/20" 
                          : "bg-transparent border-transparent hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <sev.icon className={cn("w-4 h-4", sev.color)} />
                        <span className="text-sm text-white/80 group-hover:text-white">{sev.id}</span>
                      </div>
                      {severityFilter.includes(sev.id) && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Analyst Tools</label>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-xs hover:bg-white/5 text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Show Resolved Findings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-xs hover:bg-white/5 text-white">
                  <Binary className="w-4 h-4 text-primary" />
                  CVE Deep Dive
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary/50 text-white text-lg placeholder:text-muted-foreground/30" 
              placeholder="Search by title, asset name, or CVE..." 
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-white">Synchronizing findings intelligence...</span>
              </div>
            ) : filteredVulns && filteredVulns.length > 0 ? (
              filteredVulns.map((v) => (
                <Card 
                  key={v.id} 
                  className="glass-card group hover:border-primary/30 transition-all cursor-pointer overflow-hidden border-l-4"
                  style={{ borderLeftColor: v.severity === 'Critical' ? 'hsl(var(--destructive))' : v.severity === 'High' ? '#f97316' : v.severity === 'Medium' ? '#eab308' : '#3b82f6' }}
                  onClick={() => setSelectedVuln(v)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center gap-3">
                              {v.title}
                              {v.cve && <Badge variant="outline" className="text-[10px] font-mono text-primary/80 border-primary/20">{v.cve}</Badge>}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                              <span>Asset: {v.assetName || 'Core Infrastructure'}</span>
                              <span className="opacity-30">•</span>
                              <span>Detected: {v.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                              {v.cvss && (
                                <>
                                  <span className="opacity-30">•</span>
                                  <span className={cn(v.cvss >= 7 ? "text-destructive" : "text-yellow-500")}>CVSS: {v.cvss}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={v.severity === 'Critical' || v.severity === 'High' ? 'destructive' : 'secondary'}
                            className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest"
                          >
                            {v.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                          {v.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-4">
                            <div className="text-[10px] text-muted-foreground">
                              Technique: <span className="text-white/60">{v.source || 'ZAP Engine'}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <AlertOctagon className="w-12 h-12 text-muted-foreground opacity-20" />
                <div className="space-y-1">
                  <p className="text-white font-bold">No findings detected</p>
                  <p className="text-sm text-muted-foreground">The security perimeter appears clean. Initiate a new scan to verify integrity.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedVuln} onOpenChange={(open) => !open && setSelectedVuln(null)}>
        <DialogContent className="glass-card border-white/10 text-white max-w-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
          {selectedVuln && (
            <>
              <DialogHeader className="space-y-4">
                <div className="flex justify-between items-start pr-8">
                  <Badge 
                    variant={selectedVuln.severity === 'Critical' || selectedVuln.severity === 'High' ? 'destructive' : 'secondary'}
                    className="mb-2"
                  >
                    {selectedVuln.severity} Risk
                  </Badge>
                  {selectedVuln.cvss && (
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">CVSS Impact</div>
                      <div className="text-2xl font-headline font-bold text-primary">{selectedVuln.cvss}</div>
                    </div>
                  )}
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight">{selectedVuln.title}</DialogTitle>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Asset: {selectedVuln.assetName}
                  </div>
                  {selectedVuln.cve && (
                    <div className="font-mono bg-white/5 px-2 py-0.5 rounded text-primary">{selectedVuln.cve}</div>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Technical Description
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selectedVuln.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-destructive uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4" /> Business Impact
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selectedVuln.impact}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Remediation Recommendation
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selectedVuln.recommendation}</p>
                </div>

                {selectedVuln.evidence && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Binary className="w-4 h-4" /> Telemetry Evidence
                      <Badge variant="outline" className="text-[9px] py-0 ml-auto">Live Output</Badge>
                    </h4>
                    <pre className="bg-black/40 p-4 rounded-xl text-[10px] font-code overflow-x-auto border border-white/5 text-emerald-400/80">
                      {selectedVuln.evidence}
                    </pre>
                  </div>
                )}

                <div className="pt-6 border-t border-white/10 flex gap-4">
                  <Button 
                    className="flex-1 cyber-gradient h-11 text-white font-bold"
                    onClick={() => updateVulnStatus(selectedVuln.id, 'Resolved')}
                  >
                    Eradicate Finding
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10 h-11 hover:bg-white/5 text-white" 
                    onClick={() => {
                      window.location.href = `/ai-assistant?vulnId=${selectedVuln.id}`;
                    }}
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    AI Code Fix
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}