
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Clock, 
  Monitor, 
  Smartphone, 
  MapPin, 
  History,
  LogOut,
  Mail,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAuth, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { currentUser, auth } = useAuth();
  const firestore = useFirestore();

  const sessionsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, `users/${currentUser.uid}/sessions`),
      orderBy('lastActive', 'desc'),
      limit(5)
    );
  }, [firestore, currentUser]);

  const { data: sessions } = useCollection<any>(sessionsQuery);

  const mockSessions = [
    { id: '1', device: 'MacBook Pro', browser: 'Chrome', os: 'macOS', ip: '192.168.1.1', location: 'San Francisco, CA', isCurrent: true, lastActive: new Date() },
    { id: '2', device: 'iPhone 15', browser: 'Safari', os: 'iOS', ip: '10.0.0.45', location: 'Austin, TX', isCurrent: false, lastActive: new Date(Date.now() - 86400000) },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="glass-card w-full md:w-80 shrink-0">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser?.uid}/200/200`} />
                <AvatarFallback className="text-4xl">{currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-4 border-card">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">{currentUser?.displayName || 'Security Analyst'}</h3>
              <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-none uppercase text-[10px] px-4">Level 4 Access</Badge>
            <div className="w-full pt-6 space-y-3 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-3 h-3" /> Email</span>
                <span className="text-white">Verified</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-3 h-3" /> Joined</span>
                <span className="text-white">Mar 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Active Sessions
              </CardTitle>
              <CardDescription>Managing active logins and device access across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(sessions?.length ? sessions : mockSessions).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-muted-foreground">
                      {session.os === 'iOS' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{session.device}</span>
                        {session.isCurrent && <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] h-4">Current</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{session.browser} • {session.ip}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-white flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3 text-muted-foreground" /> {session.location}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Last active {new Date(session.lastActive).toLocaleTimeString()}</p>
                    </div>
                    {!session.isCurrent && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Security Timeline
              </CardTitle>
              <CardDescription>Recent sensitive account activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { action: 'Login Success', date: '2 hours ago', icon: Shield, color: 'text-emerald-500' },
                { action: 'Password Update', date: '14 days ago', icon: Lock, color: 'text-primary' },
                { action: 'API Key Created', date: '21 days ago', icon: Zap, color: 'text-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative group">
                  <div className={cn("w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10", item.color)}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pb-4 border-b border-white/5 group-last:border-none">
                    <p className="text-sm font-bold text-white">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground">{item.date} • Verified via MFA</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
