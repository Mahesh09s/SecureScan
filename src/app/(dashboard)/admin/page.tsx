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
  Cpu
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

export default function AdminPanelPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Queries for different admin sections
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
      toast({ title: "Role Updated", description: `User role has been changed to ${newRole}.` });
      logAuditEvent('System', 'System Admin', 'ROLE_UPDATE', `Updated role of user ${userId} to ${newRole}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'users', userId));
      toast({ title: "User Deleted" });
      logAuditEvent('System', 'System Admin', 'SETTINGS_CHANGE', `Deleted user ${userId}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Deletion Failed" });
    }
  };

  const systemStats = useMemo(() => {
    return [
      { label: 'Total Operators', value: users?.length || 0, icon: Users, color: 'text-blue-500' },
      { label: 'Active Engines', value: allScans?.filter(s => s.status === 'In Progress').length || 0, icon: Activity, color: 'text-primary' },
      { label: 'Audit Events', value: auditLogs?.length || 0, icon: Database, color: 'text-orange-500' },
      { label: 'CPU Load', value: '14%', icon: Cpu, color: 'text-emerald-500' },
    ];
  }, [users, allScans, auditLogs]);

  const permissionMatrix = [
    { role: 'admin', read: true, write: true, delete: true, execute: true },
    { role: 'analyst', read: true, write: true, delete: false, execute: true },
    { role: 'viewer', read: true, write: false, delete: false, execute: false },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-destructive" />
            Governance Control Center
          </h2>
          <p className="text-muted-foreground">Manage organizational security posture, administrative roles, and audit compliance.</p>
        </div>
        <Button className="cyber-gradient border-none rounded-xl gap-2 h-11 text-white font-bold">
          <UserPlus className="w-5 h-5" />
          Provision Analyst
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="glass-card p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <h4 className="text-3xl font-headline font-bold text-white">{stat.value}</h4>
              </div>
              <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 w-full justify-start overflow-x-auto">
          <TabsTrigger value="users" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Users className="w-4 h-4" /> User Directory
          </TabsTrigger>
          <TabsTrigger value="matrix" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <ShieldCheck className="w-4 h-4" /> Permission Matrix
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <History className="w-4 h-4" /> Immutable Audit Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Settings className="w-4 h-4" /> Global Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Operator Management</CardTitle>
                <CardDescription>Configure access levels and monitor authentication status.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search operators..." 
                  className="pl-10 bg-white/5 border-white/10 text-white" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Operator</TableHead>
                    <TableHead className="text-muted-foreground">Privilege</TableHead>
                    <TableHead className="text-muted-foreground">Compliance Status</TableHead>
                    <TableHead className="text-muted-foreground">Last Active</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{user.displayName || 'Security Operator'}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "uppercase text-[10px]",
                          user.role === 'admin' ? "text-destructive border-destructive/30" : "text-primary border-primary/30"
                        )}>
                          {user.role || 'analyst'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">VERIFIED</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {user.lastLogin?.toDate ? user.lastLogin.toDate().toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full text-white"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-white/10 text-white">
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'admin')}>Promote to Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'analyst')}>Assign Analyst Role</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteUser(user.id)} className="text-destructive focus:text-destructive">Revoke Access</DropdownMenuItem>
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
            <CardHeader>
              <CardTitle className="text-white">RBAC Entitlements Matrix</CardTitle>
              <CardDescription>Granular access control definition for system resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">System Role</TableHead>
                    <TableHead className="text-center text-muted-foreground">Read Telemetry</TableHead>
                    <TableHead className="text-center text-muted-foreground">Write Config</TableHead>
                    <TableHead className="text-center text-muted-foreground">Destructive Actions</TableHead>
                    <TableHead className="text-center text-muted-foreground">Engine Execution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionMatrix.map((p) => (
                    <TableRow key={p.role} className="border-white/5">
                      <TableCell className="font-bold text-white capitalize">{p.role}</TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.read} disabled className="mx-auto" /></TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.write} disabled className="mx-auto" /></TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.delete} disabled className="mx-auto" /></TableCell>
                      <TableCell className="text-center"><Checkbox checked={p.execute} disabled className="mx-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Security Event Archive</CardTitle>
              <CardDescription>Immutable record of all sensitive platform operations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Event Horizon</TableHead>
                    <TableHead className="text-muted-foreground">Subject</TableHead>
                    <TableHead className="text-muted-foreground">Operation</TableHead>
                    <TableHead className="text-muted-foreground">Object Context</TableHead>
                    <TableHead className="text-muted-foreground">Telemetry Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log: any) => (
                    <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="text-xs text-muted-foreground font-mono">{log.timestamp?.toDate().toLocaleString()}</TableCell>
                      <TableCell className="text-xs font-bold text-white">{log.userEmail}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10 text-white font-mono">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">{log.details}</TableCell>
                      <TableCell className="text-[10px] font-mono opacity-50 text-white">{log.ipAddress || 'Production-API'}</TableCell>
                    </TableRow>
                  ))}
                  {(!auditLogs || auditLogs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No audit events recorded in this cycle.
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