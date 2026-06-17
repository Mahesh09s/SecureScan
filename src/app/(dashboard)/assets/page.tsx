"use client";

import { ASSETS } from '@/lib/data-mock';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Globe, 
  Server, 
  Hash, 
  MoreVertical,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

export default function AssetsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Asset Inventory</h2>
          <p className="text-muted-foreground">Manage and track your authorized security targets.</p>
        </div>
        <Button className="cyber-gradient border-none shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl gap-2 h-11 px-6">
          <Plus className="w-5 h-5" />
          Add New Asset
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/50" 
            placeholder="Search by name, target or owner..." 
          />
        </div>
        <Button variant="outline" className="border-white/10 h-12 rounded-xl gap-2 hover:bg-white/5">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Asset</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Target</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Type</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Owner</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSETS.map((asset) => (
              <TableRow key={asset.id} className="border-border hover:bg-white/5 transition-colors group">
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {asset.type === 'Website' ? <Globe className="w-4 h-4" /> : asset.type === 'Server' ? <Server className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                    </div>
                    <span className="font-bold text-white group-hover:text-primary transition-colors">{asset.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">{asset.target}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-white/10">
                    {asset.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      asset.status === 'Healthy' ? "bg-emerald-500" : asset.status === 'Scanning' ? "bg-primary" : "bg-destructive"
                    )}></div>
                    <span className="text-xs font-medium text-white">{asset.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{asset.owner}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-l-4 border-l-primary p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Asset Verification Mandatory</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before initiating any automated scans, you must verify ownership of the target. Scanning systems without explicit authorization is prohibited and may have legal consequences.
              </p>
              <Button variant="link" className="text-primary p-0 h-auto mt-2 text-xs">Learn about verification methods →</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
