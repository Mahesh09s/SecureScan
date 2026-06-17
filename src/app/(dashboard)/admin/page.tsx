
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  UserPlus
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
  getDoc
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

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
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  const systemStats = useMemo(() => {
    return [
      { label: 'Total Users', value: users?.length || 0, icon: Users, color: 'text-blue-500' },
      { label: 'Active Scans', value: allScans?.filter(s => s.status === 'In Progress').length || 0, icon: Activity, color: 'text-primary' },
      { label: 'System Alerts', value: 0, icon: AlertTriangle, color: 'text-orange-500' },
      { label: 'Cloud Resources', value: 14, icon: Server, color: 'text-emerald-500' },
    ];
  }, [users, allScans]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-destructive" />
            System Administration
          </h2>
          <p className="text-muted-foreground">Manage organizational security posture, users, and audit compliance.</p>
        </div>
        <Button className="cyber-gradient border-none rounded-xl gap-2 h-11">
          <UserPlus className="w-5 h-5" />
          Provision User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="glass-card p-6 border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <h4 className="text-3xl font-headline font-bold text-white">{stat.value}</h4>
              </div>
              <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14">
          <TabsTrigger value="users" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="scans" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Activity className="w-4 h-4" /> Global Scans
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <History className="w-4 h-4" /> Audit Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Settings className="w-4 h-4" /> System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage user access levels and authentication status.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10 bg-white/5 border-white/10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{user.displayName || 'Unnamed User'}</span>
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
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Active</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {user.createdAt?.toDate().toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-white/10 text-white">
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'admin')}>Promote to Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'analyst')}>Demote to Analyst</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
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

        <TabsContent value="audit" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>Immutable record of all sensitive actions across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log: any) => (
                    <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="text-xs text-muted-foreground">{log.timestamp?.toDate().toLocaleString()}</TableCell>
                      <TableCell className="text-xs font-bold text-white">{log.userEmail}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10 text-white">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">{log.details}</TableCell>
                      <TableCell className="text-[10px] font-mono opacity-50">{log.ipAddress || 'Internal'}</TableCell>
                    </TableRow>
                  ))}
                  {(!auditLogs || auditLogs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No audit events recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Access Control
                </CardTitle>
                <CardDescription>Configure global security policies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Restrict New Registrations</p>
                    <p className="text-xs text-muted-foreground">Only invited users can join the platform.</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Enforce 2FA</p>
                    <p className="text-xs text-muted-foreground">Require two-factor authentication for all users.</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10">Disable</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-500" />
                  Notifications
                </CardTitle>
                <CardDescription>Global alert configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Slack Integration</p>
                    <p className="text-xs text-muted-foreground">Send critical alerts to #security-ops.</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-none">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Email Summaries</p>
                    <p className="text-xs text-muted-foreground">Daily digest of new vulnerabilities.</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
