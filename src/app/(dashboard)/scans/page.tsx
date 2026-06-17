
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Square, Search, List, Activity, Terminal, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

const scanTypes = [
  { id: 'full', name: 'Comprehensive Scan', description: 'Port scan, nuclei templates, and full vuln search', icon: Zap },
  { id: 'nmap', name: 'Nmap Port Scan', description: 'Port discovery and service fingerprinting', icon: List },
  { id: 'header', name: 'HTTP Header Scanner', description: 'Analyze response headers for security best practices', icon: Search },
  { id: 'ssl', name: 'SSL Checker', description: 'Check certificates and cipher suite vulnerabilities', icon: Activity },
  { id: 'tech', name: 'WhatWeb Fingerprint', description: 'Identify server technologies and versions', icon: Globe },
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
      limit(5)
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
      toast({ variant: "destructive", title: "Missing Asset", description: "Please select an asset to scan." });
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
        logs: [`[START] Initiating ${selectedScanType} scan for: ${asset?.target}`],
        vulnerabilitiesFound: 0,
        ownerId: currentUser.uid,
        startedAt: serverTimestamp(),
      });

      setActiveScanId(scanRef.id);
      await updateDoc(doc(firestore, 'assets', selectedAssetId), { status: "Scanning" });

      logAuditEvent(currentUser.uid, currentUser.email!, 'SCAN_START', `Started ${selectedScanType} scan on ${asset?.name}`, scanRef.id);
      simulateScan(scanRef.id, asset);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Scan Error", description: "Failed to launch scan engine." });
    }
  };

  const simulateScan = async (scanId: string, asset: any) => {
    if (!firestore || !currentUser) return;
    
    const scanRef = doc(firestore, 'scans', scanId);
    const steps = [
      { p: 10, log: "Initializing scan engine nodes..." },
      { p: 25, log: `Running Nmap discovery on ${asset.target}...` },
      { p: 40, log: "Analyzing SSL/TLS certificate chains..." },
      { p: 55, log: "Detecting tech stack with WhatWeb fingerprinting..." },
      { p: 70, log: "Performing OWASP ZAP baseline web crawling..." },
      { p: 85, log: "Executing Nuclei high-severity templates..." },
      { p: 95, log: "Compiling vulnerability report..." },
    ];

    let currentLogs = [`[START] Initiating scan for: ${asset.target}`];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 1200));
      currentLogs.push(`[LOG] ${step.log}`);
      await updateDoc(scanRef, {
        progress: step.p,
        logs: currentLogs
      });
    }

    // Generate simulated vulnerabilities
    const findings = [
      {
        title: "Missing Content-Security-Policy Header",
        severity: "Medium",
        cvss: 4.3,
        description: "The application does not implement a CSP header, increasing the risk of XSS attacks.",
        impact: "Allows attackers to execute malicious scripts in the context of the user's browser.",
        recommendation: "Implement a restrictive CSP header.",
        evidence: "Header 'Content-Security-Policy' not found in response.",
        source: "SecureScan Header Engine"
      },
      {
        title: "Outdated Web Server Version (Apache 2.4.41)",
        severity: "High",
        cvss: 7.5,
        cve: "CVE-2021-41773",
        description: "The detected Apache version is vulnerable to path traversal and file disclosure.",
        impact: "Remote attackers can read arbitrary files from the server.",
        recommendation: "Update Apache to version 2.4.51 or higher.",
        evidence: "Server: Apache/2.4.41 (Ubuntu)",
        source: "Nmap Fingerprinter"
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
      progress: 100,
      status: "Completed",
      vulnerabilitiesFound: findings.length,
      completedAt: serverTimestamp(),
      logs: [...currentLogs, "[COMPLETE] Scan finished. Findings available in Vulnerabilities page."]
    });
    
    await updateDoc(doc(firestore, 'assets', asset.id), { 
      status: findings.length > 0 ? "Vulnerable" : "Healthy" 
    });

    // Create Notification
    await addDoc(collection(firestore, 'notifications'), {
      userId: currentUser.uid,
      title: "Scan Completed",
      message: `The ${selectedScanType} scan on ${asset.name} has finished. ${findings.length} issues identified.`,
      type: "success",
      read: false,
      createdAt: serverTimestamp(),
    });

    logAuditEvent(currentUser.uid, currentUser.email!, 'SCAN_STOP', `Completed scan on ${asset.name}`, scanId);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-headline font-bold text-white text-glow">Scan Engine</h2>
        <p className="text-muted-foreground">Launch automated security assessments on your authorized assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Target Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select 
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="" className="bg-card">Select an Asset...</option>
                {assets?.map(asset => (
                  <option key={asset.id} value={asset.id} className="bg-card">
                    {asset.name} ({asset.target})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanTypes.map(type => (
                  <div 
                    key={type.id} 
                    onClick={() => setSelectedScanType(type.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer group",
                      selectedScanType === type.id 
                        ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        selectedScanType === type.id ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      )}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-white">{type.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-headline">Live Output</CardTitle>
              </div>
              {activeScan && (
                <Badge variant="outline" className="animate-pulse bg-primary/20 text-primary border-primary/30">
                  SCANNING
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-black/40 rounded-xl p-4 font-code text-[10px] space-y-1.5 h-[350px] overflow-y-auto scrollbar-hide border border-white/5">
                {!activeScan && <p className="text-muted-foreground/50 italic">Waiting for scan to start...</p>}
                {(activeScan?.logs || []).map((entry: string, i: number) => (
                  <p key={i} className={cn(
                    "flex gap-3",
                    entry.includes('[COMPLETE]') ? "text-emerald-400" : entry.includes('[START]') ? "text-primary font-bold" : "text-white/60"
                  )}>
                    <span className="opacity-30 whitespace-nowrap">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="break-all">{entry}</span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Execution Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Progress</label>
                  <span className="text-xl font-headline font-bold text-primary">{activeScan?.progress || 0}%</span>
                </div>
                <Progress value={activeScan?.progress || 0} className="h-2 bg-white/5" />
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={startScan} 
                  disabled={!!activeScanId || !selectedAssetId}
                  className="w-full cyber-gradient h-12 rounded-xl gap-2 text-white font-bold"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Launch SecureScan
                </Button>
                
                {activeScanId && (
                  <Button variant="destructive" className="w-full h-12 rounded-xl gap-2 font-bold">
                    <Square className="w-4 h-4 fill-white" />
                    Emergency Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {recentScans?.map((scan: any) => (
                  <div key={scan.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">{scan.target}</span>
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-1.5 py-0",
                        scan.status === 'Completed' ? "text-emerald-400 border-emerald-400/20" : "text-primary border-primary/20"
                      )}>
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                      <span>{scan.type}</span>
                      <span>{scan.startedAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
