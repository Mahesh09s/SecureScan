"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Square, RefreshCcw, Search, List, Activity, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const scanTypes = [
  { id: 'full', name: 'Comprehensive Scan', description: 'Port scan, headers, and full vuln search', icon: Zap },
  { id: 'port', name: 'Port Scanning', description: 'Identify open services and fingerprinting', icon: List },
  { id: 'header', name: 'HTTP Security Headers', description: 'Analyze response headers for security best practices', icon: Search },
  { id: 'ssl', name: 'SSL/TLS Assessment', description: 'Check certificates and cipher suite vulnerabilities', icon: Activity },
];

export default function ScansPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    let interval: any;
    if (isScanning && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.random() * 5;
          if (next >= 100) {
            setIsScanning(false);
            setLog(prevLog => [...prevLog, "[COMPLETE] Scan finished successfully.", "Found 4 vulnerabilities."]);
            return 100;
          }
          return next;
        });

        // Add dummy logs
        if (Math.random() > 0.7) {
          const steps = [
            "Initializing Nmap...",
            "Scanning ports 1-1024...",
            "Service detection for 443/tcp...",
            "Analyzing security headers...",
            "Performing directory enumeration...",
            "Checking CVE-2023-44487..."
          ];
          setLog(prevLog => [...prevLog.slice(-10), `[LOG] ${steps[Math.floor(Math.random() * steps.length)]}`]);
        }
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isScanning, progress]);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setLog(["[START] Initiating scan for: api.securescan.io", "Setting up environment..."]);
  };

  const stopScan = () => {
    setIsScanning(false);
    setLog(prev => [...prev, "[INTERRUPTED] User cancelled the scan."]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-headline font-bold text-white">Scan Engine</h2>
        <p className="text-muted-foreground">Launch automated security assessments on your authorized assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanTypes.map(type => (
                <div key={type.id} className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <type.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">{type.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-headline">Live Output</CardTitle>
              </div>
              {isScanning && (
                <Badge variant="outline" className="animate-pulse bg-primary/20 text-primary border-primary/30">
                  SCANNING
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-black/40 rounded-xl p-4 font-code text-xs space-y-2 h-[300px] overflow-y-auto scrollbar-hide border border-white/5">
                {log.length === 0 && <p className="text-muted-foreground/50 italic">Waiting for scan to start...</p>}
                {log.map((entry, i) => (
                  <p key={i} className={cn(
                    "flex gap-3",
                    entry.includes('[COMPLETE]') ? "text-emerald-500" : entry.includes('[START]') ? "text-primary" : entry.includes('[INTERRUPTED]') ? "text-destructive" : "text-white/70"
                  )}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                    {entry}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Scan Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Selected Target</label>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm">
                  api.securescan.io
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Progress</label>
                  <span className="text-xl font-headline font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                  <span>EST. TIME: 4m 20s</span>
                  <span>THREADS: 16</span>
                </div>
              </div>

              <div className="flex gap-3">
                {!isScanning ? (
                  <Button onClick={startScan} className="flex-1 cyber-gradient h-12 rounded-xl gap-2 text-white font-bold">
                    <Play className="w-4 h-4 fill-white" />
                    Launch Scan
                  </Button>
                ) : (
                  <Button onClick={stopScan} variant="destructive" className="flex-1 h-12 rounded-xl gap-2 font-bold">
                    <Square className="w-4 h-4 fill-white" />
                    Stop Scan
                  </Button>
                )}
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10" onClick={() => { setProgress(0); setLog([]); }}>
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h4 className="text-sm font-bold text-white mb-2">Security Tip</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Perform header scans weekly to ensure your servers haven't regressed after configuration changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}