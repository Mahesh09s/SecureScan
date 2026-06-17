"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Square, Search, List, Activity, Terminal, Globe, Pause, RefreshCw, Trash2, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, query, where, orderBy, limit, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

const scanTypes = [
  { id: 'full', name: 'Comprehensive Audit', description: 'Deep port analysis, service fingerprinting, and OWASP baseline templates.', icon: Zap },
  { id: 'nmap', name: 'Port Discovery', description: 'Advanced service enumeration and network topology mapping.', icon: List },
  { id: 'ssl', name: 'TLS Integrity Checker', description: 'Verify certificate chains, cipher strengths, and protocol vulnerabilities.', icon: Activity },
  { id: 'tech', name: 'Stack Profiler', description: 'Fingerprint server technologies, versions, and exposed software patterns.', icon: Globe },
];

export default function ScansPage() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [activeScan, setActiveScan] = useState<any>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [selectedScanType, setSelectedScanType] = useState<string>("full");

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
        }
      }
    });
    return () => unsubscribe();
  }, [firestore, activeScanId]);

  const startScan = async () => {
    if (!firestore || !currentUser || !selectedAssetId) {
      toast({ variant: "destructive", title: "Target Missing", description: "Select an authorized asset to initiate the scan engine." });
      return;
    }

    const asset = assets.find(a => a.id === selectedAssetId);
    
    try {
      const scanRef = await addDoc(collection(firestore, 'scans'), {
        assetId: selectedAssetId,
        target: asset?.target || "Unknown",
        type: selectedScanType,
        status: "In Progress",
        progress: 0,
        logs: [`[START] Engine initialized for target: ${asset?.target}`],
        vulnerabilitiesFound: 0,
        ownerId: currentUser.uid,
        startedAt: serverTimestamp(),
      });

      setActiveScanId(scanRef.id);
      await updateDoc(doc(firestore, 'assets', selectedAssetId), { status: "Scanning" });

      logAuditEvent(currentUser.uid, currentUser.email!, 'SCAN_START', `Started ${selectedScanType} scan on ${asset?.name}`, scanRef.id);
      simulateScan(scanRef.id, asset);
    } catch (error) {
      toast({ variant: "destructive", title: "Engine Fault", description: "Failed to provision scan node." });
    }
  };

  const simulateScan = async (scanId: string, asset: any) => {
    if (!firestore || !currentUser) return;
    
    const scanRef = doc(firestore, 'scans', scanId);
    const steps = [
      { p: 15, log: "Provisioning global scan node (Region: US-EAST)..." },
      { p: 30, log: `Nmap SYN Stealth Scan initiated on ${asset.target}...` },
      { p: 45, log: "Analyzing TLS handshake and certificate chain validity..." },
      { p: 60, log: "Identifying web stack via fingerprinter (WhatWeb simulation)..." },
      { p: 75, log: "Running OWASP baseline vulnerability templates..." },
      { p: 90, log: "Compiling telemetry into structured audit format..." },
      { p: 100, log: "Scan finalized. Sanitizing temporary scan data..." },
    ];

    let currentLogs = [`[START] Engine initialized for target: ${asset.target}`];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 1500));
      currentLogs.push(`[TELEMETRY] ${step.log}`);
      await updateDoc(scanRef, {
        progress: step.p,
        logs: currentLogs
      });
    }

    const findings = [
      {
        title: "Missing HSTS and CSP Security Headers",
        severity: "High",
        cvss: 7.2,
        description: "The target does not enforce HTTP Strict Transport Security (HSTS) or a robust Content Security Policy (CSP).",
        impact: "Vulnerable to protocol downgrade attacks and cross-site scripting (XSS).",
        recommendation: "Implement 'Strict-Transport-Security' and 'Content-Security-Policy' response headers.",
        evidence: "HTTP/1.1 200 OK\nServer: nginx\n(Missing CSP/HSTS)",
        source: "SecureScan Audit Engine"
      },
      {
        title: "Exposed Server Banner (NGINX/1.18.0)",
        severity: "Medium",
        cvss: 5.0,
        description: "The web server version is exposed in the HTTP headers, providing reconnaissance data to potential attackers.",
        impact: "Assists in identifying version-specific exploits.",
        recommendation: "Configure server to hide version banners (e.g., 'server_tokens off' in nginx).",
        evidence: "Server: nginx/1.18.0 (Ubuntu)",
        source: "Fingerprinter Node"
      }
    ];

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
      logs: [...currentLogs, "[SUCCESS] Assessment finalized. Vulnerability database synchronized."]
    });
    
    await updateDoc(doc(firestore, 'assets', asset.id), { 
      status: findings.length > 0 ? "Vulnerable" : "Healthy" 
    });

    await addDoc(collection(firestore, 'notifications'), {
      userId: currentUser.uid,
      title: "Assessment Finalized",
      message: `The ${selectedScanType} audit on ${asset.name} is complete. ${findings.length} findings identified.`,
      type: "success",
      read: false,
      createdAt: serverTimestamp(),
    });

    logAuditEvent(currentUser.uid, currentUser.email!, 'SCAN_STOP', `Completed assessment on ${asset.name}`, scanId);
  };

  const clearRecentScans = async () => {
    if (!firestore || !currentUser) return;
    const snap = await getDocs(query(collection(firestore, 'scans'), where('ownerId', '==', currentUser.uid)));
    const batch = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(batch);
    toast({ title: "History Cleared" });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-headline font-bold text-white text-glow">Scan Engine Hub</h2>
        <p className="text-muted-foreground">Orchestrate automated security assessments across your digital surface.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader className="border-b border-white/5 bg-white/[0.01]">
              <CardTitle className="text-lg font-headline text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Target Orchestration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Authorized Asset</label>
                <select 
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:ring-1 focus:ring-primary/50 text-sm"
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
                      <span className="font-bold text-white text-sm">{type.name}</span>
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
                <CardTitle className="text-lg font-headline text-white">Live Telemetry Feed</CardTitle>
              </div>
              {activeScan && (
                <Badge variant="outline" className="animate-pulse bg-primary/20 text-primary border-primary/30 font-bold px-3">
                  ENGINES ACTIVE
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-black/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed space-y-2 h-[350px] overflow-y-auto scrollbar-hide border border-white/5 shadow-inner">
                {!activeScan && <p className="text-muted-foreground/30 italic text-center py-20">Awaiting target selection and execution command...</p>}
                {(activeScan?.logs || []).map((entry: string, i: number) => (
                  <p key={i} className={cn(
                    "flex gap-4",
                    entry.includes('[SUCCESS]') ? "text-emerald-400 font-bold" : entry.includes('[START]') ? "text-primary font-bold" : "text-white/60"
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
                Engine Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Audit Progress</label>
                  <span className="text-2xl font-headline font-bold text-primary">{activeScan?.progress || 0}%</span>
                </div>
                <Progress value={activeScan?.progress || 0} className="h-2.5 bg-white/5" />
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={startScan} 
                  disabled={!!activeScanId || !selectedAssetId}
                  className="w-full cyber-gradient h-14 rounded-2xl gap-3 text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Initiate Assessment
                </Button>
                
                {activeScanId && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5 gap-2">
                      <Pause className="w-4 h-4" /> Pause
                    </Button>
                    <Button variant="destructive" className="h-12 gap-2 font-bold shadow-lg shadow-destructive/20">
                      <Square className="w-4 h-4 fill-white" /> Abort
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Est. Completion: {activeScanId ? ' ~3 minutes' : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Last Baseline: {recentScans?.[0]?.completedAt?.toDate().toLocaleDateString() || 'Never'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.01] py-4">
              <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Audit History</CardTitle>
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
                  <div className="p-10 text-center text-muted-foreground italic text-xs">History archive empty.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}