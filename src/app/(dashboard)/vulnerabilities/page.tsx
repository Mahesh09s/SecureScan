
"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  ArrowUpRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export default function VulnerabilitiesPage() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const vulnsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, 'vulnerabilities'),
      where('ownerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, currentUser]);

  const { data: vulnerabilities, loading } = useCollection<any>(vulnsQuery);

  const filteredVulns = vulnerabilities?.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.severity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Vulnerability Inventory</h2>
          <p className="text-muted-foreground">Comprehensive database of all detected security findings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 rounded-xl gap-2 hover:bg-white/5 text-white">
            <Download className="w-4 h-4" />
            Export Results
          </Button>
          <Button className="cyber-gradient border-none shadow-lg rounded-xl gap-2">
            <ShieldAlert className="w-4 h-4" />
            Trigger Batch Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Quick Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Severity</label>
                <div className="space-y-1">
                  {['Critical', 'High', 'Medium', 'Low'].map(sev => (
                    <label key={sev} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                      <input type="checkbox" className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20" />
                      <span className="text-sm text-white/70 group-hover:text-white">{sev}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary/50 text-white text-lg" 
              placeholder="Search by vulnerability name or CVE ID..." 
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                Synchronizing findings...
              </div>
            ) : filteredVulns && filteredVulns.length > 0 ? (
              filteredVulns.map((v) => (
                <Card key={v.id} className="glass-card group hover:border-primary/30 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{v.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {v.cve && <span className="font-mono text-primary/80">{v.cve}</span>}
                              <span>•</span>
                              <span>{v.source || 'Scanner Engine'}</span>
                              <span>•</span>
                              <span>{v.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={v.severity === 'Critical' ? 'destructive' : v.severity === 'High' ? 'destructive' : 'secondary'}
                            className={cn(
                              "px-4 py-1 text-xs font-headline font-bold uppercase tracking-widest",
                              v.severity === 'Medium' && "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                            )}
                          >
                            {v.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {v.description}
                        </p>
                        <div className="flex gap-3">
                          <Button variant="link" className="text-xs p-0 h-auto text-primary gap-1">
                            View Details <ArrowUpRight className="w-3 h-3" />
                          </Button>
                          <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground hover:text-white transition-colors">
                            Analyze Remediation
                          </Button>
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
                  <p className="text-sm text-muted-foreground">Your attack surface appears clean.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
