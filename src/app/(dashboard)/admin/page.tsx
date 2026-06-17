"use client";

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  ShieldAlert, 
  History, 
  Settings, 
  Bell, 
  Search, 
  MoreVertical,
  Activity,
  Server,
  AlertTriangle,
  Lock,
  UserPlus,
  ShieldCheck,
  Eye,
  Edit2,
  Trash2,
  ShieldQuestion,
  Database,
  Cpu,
  Fingerprint,
  ArrowUpRight,
  ShieldX
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useFirestore, useCollection } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

export default function GovernanceControlCenter() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const usersQuery = useMemo(() => firestore ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc')) : null, [firestore]);
  const auditLogsQuery = useMemo(() => firestore ? query(collection(firestore, 'auditLogs'), orderBy('timestamp', 'desc')) : null, [firestore]);
  const globalScansQuery = useMemo(() => firestore ? query(collection(firestore, 'scans'), orderBy('startedAt', 'desc')) : null, [firestore]);

  const { data: users, loading: usersLoading } = useCollection<any>(usersQuery);
  const { data: auditLogs, loading: logsLoading } = useCollection<any>(auditLogsQuery);
  const { data: allScans, loading: scansLoading } = useCollection<any>(globalScansQuery);

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!firestore) return;
    try {
      await updateDoc(doc(firestore, 'users', userId), { 
        role: newRole,
        updatedAt: serverTimestamp() 
      });
      toast({ title: "Privilege Level Escalated", description: `User role has been updated to ${newRole}.` });
      logAuditEvent('System', 'System Admin', 'ROLE_UPDATE', `Updated role of user ${userId} to ${newRole}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Entitlement Update Failed" });
    }
  };

  const systemStats = useMemo(() => {
    return [
      { label: 'Authorized Operators', value: users?.length || 0, icon: Users, color: 'text-blue-400' },
      { label: 'Active Audit Nodes', value: allScans?.filter(s => s.status === 'In Progress').length || 0, icon: Activity, color: 'text-primary' },
      { label: 'Governance Events', value: auditLogs?.length || 0, icon: Database, color: 'text-orange-400' },
      { label: 'System Resource Load', value: '14.2%', icon: Cpu, color: 'text-emerald-400' },
    ];
  }, [users, allScans, auditLogs]);

  const permissionMatrix = [
    { role: 'admin', read: true, write: true, delete: true, execute: true },
    { role: 'analyst', read: true, write: true, delete: false, execute: true },
    { role: 'viewer', read: true, write: false, delete: false, execute: false },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Tactical Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5 px-3 py-0.5 text-[10px] font-black tracking-widest uppercase">
              Secure Context: Global Administrator
            </Badge>
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
          </div>
          <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Governance Control Center</h2>
          <p className="text-muted-foreground text-sm font-medium">Manage organizational posture, analyst entitlements, and immutable audit compliance.</p>
        </div>
        
        <Button className="cyber-gradient border-none rounded-xl h-11 px-6 font-bold text-white shadow-lg shadow-primary/20 gap-2">
          <UserPlus className="w-4 h-4" /> Provision Security Analyst
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="glass-card p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-2xl font-headline font-bold text-white">{stat.value}</h4>
              </div>
              <div className={cn("p-2.5 rounded-xl bg-white/[0.03] border border-white/5", stat.color)}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground">REAL-TIME TELEMETRY</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/[0.03] border border-white/5 p-1 rounded-2xl h-14 w-full justify-start overflow-x-auto scrollbar-hide">
          <TabsTrigger value="users" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-[13px] gap-2 transition-all">
            <Users className="w-4 h-4" /> Operator Directory
          </TabsTrigger>
          <TabsTrigger value="matrix" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-[13px] gap-2 transition-all">
            <Fingerprint className="w-4 h-4" /> Entitlement Matrix
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-[13px] gap-2 transition-all">
            <History className="w-4 h-4" /> Immutable Audit Archive
          </TabsTrigger>
          <TabsTrigger value="policy" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-[13px] gap-2 transition-all">
            <ShieldCheck className="w-4 h-4" /> System Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8 bg-white/[0.01] border-b border-white/5">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-tight">Security Analyst Directory</CardTitle>
                <CardDescription className="text-xs">Configure granular access levels and monitor authentication compliance.</CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search authorized personnel..." 
                  className="pl-11 h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Operator</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Privilege Level</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Compliance Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Session Pulse</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full cyber-gradient flex items-center justify-center font-bold text-white text-xs">
                            {user.displayName?.[0] || 'O'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[13px] text-white leading-tight">{user.displayName || 'Security Operator'}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "uppercase text-[9px] font-black tracking-widest border-none px-3 py-1",
                          user.role === 'admin' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                        )}>
                          {user.role || 'analyst'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[10px] font-black text-emerald-500/80 uppercase">VERIFIED</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-[11px] font-mono">
                        {user.lastLogin?.toDate ? user.lastLogin.toDate().toLocaleString() : 'PULSE_OFFLINE'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-white"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#020617] border-white/10 text-white min-w-[200px]">
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'admin')} className="gap-2 font-bold py-2.5">
                              <ShieldAlert className="w-4 h-4 text-destructive" /> Escalate to Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'analyst')} className="gap-2 font-bold py-2.5">
                              <User className="w-4 h-4 text-primary" /> Assign Analyst Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}} className="gap-2 font-bold py-2.5 text-destructive focus:text-destructive">
                              <ShieldX className="w-4 h-4" /> Revoke Authorization
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-lg font-bold text-white tracking-tight">Entitlement Matrix (RBAC)</CardTitle>
              <CardDescription className="text-xs">Granular authorization definitions for organization-wide security resources.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 px-8">System Role</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">Read Telemetry</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">Write Assets</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">Execute Engines</TableHead>
                    <TableHead className="text-center text-[10px] font-black uppercase tracking-widest">Destructive Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionMatrix.map((p) => (
                    <TableRow key={p.role} className="border-white/5 py-4">
                      <TableCell className="font-bold text-[13px] text-white capitalize px-8">{p.role}</TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.read} disabled className="mx-auto border-white/10" /></TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.write} disabled className="mx-auto border-white/10" /></TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.execute} disabled className="mx-auto border-white/10" /></TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.delete} disabled className="mx-auto border-white/10" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-lg font-bold text-white tracking-tight">Governance Event Archive</CardTitle>
              <CardDescription className="text-xs">Immutable cryptographic record of all sensitive platform operations.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 px-8">Event Horizon</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Operator</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Action Code</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Context Detail</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">IP Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log: any) => (
                    <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="text-[11px] text-muted-foreground font-mono px-8">{log.timestamp?.toDate().toLocaleString()}</TableCell>
                      <TableCell className="text-[11px] font-bold text-white">{log.userEmail}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[9px] font-black bg-white/5 border-white/10 text-white font-mono uppercase tracking-tighter">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground max-w-[240px] truncate">{log.details}</TableCell>
                      <TableCell className="text-[10px] font-mono text-primary/60">{log.ipAddress || '10.0.45.1'}</TableCell>
                    </TableRow>
                  ))}
                  {(!auditLogs || auditLogs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-32 text-muted-foreground italic text-xs">
                        Audit archive currently empty for the selected cycle.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}