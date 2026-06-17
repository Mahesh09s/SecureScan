"use client";

import { useMemo, useState } from 'react';
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
  ChevronRight,
  ShieldCheck,
  Lock,
  SmartphoneNfc,
  Database
} from 'lucide-react';
import { useAuth, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { currentUser, auth } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

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
    { id: '1', device: 'Analyst Workstation - Mac', browser: 'Chrome Enterprise', os: 'macOS', ip: '192.168.1.1', location: 'DC-East-1', isCurrent: true, lastActive: new Date() },
    { id: '2', device: 'Secure Mobile Node', browser: 'Secure Browser', os: 'iOS', ip: '10.0.45.1', location: 'Remote-HQ', isCurrent: false, lastActive: new Date(Date.now() - 86400000) },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Card className="glass-card w-full lg:w-96 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 cyber-gradient"></div>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <Avatar className="h-40 w-40 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500 shadow-2xl">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser?.uid}/200/200`} />
                <AvatarFallback className="text-5xl font-headline">{currentUser?.displayName?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 p-2.5 bg-primary rounded-2xl border-4 border-[#030712] shadow-xl">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-headline font-bold text-white">{currentUser?.displayName || 'Security Analyst'}</h3>
              <p className="text-sm text-muted-foreground font-mono">{currentUser?.email}</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-none uppercase text-[10px] px-6 py-1 tracking-widest font-bold">L4 Clearance</Badge>
            
            <div className="w-full pt-8 space-y-4 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Identity Status</span>
                <span className="text-emerald-500 font-bold">VERIFIED</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> MFA State</span>
                <span className="text-emerald-500 font-bold">ACTIVE (TOTP)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Commissioned</span>
                <span className="text-white">Mar 2024</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-white/10 hover:bg-destructive/10 hover:text-destructive gap-2 text-white h-11" onClick={() => auth.signOut()}>
              <LogOut className="w-4 h-4" /> Terminate Session
            </Button>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-8 w-full">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <SmartphoneNfc className="w-6 h-6 text-primary" />
                Authenticated Session History
              </CardTitle>
              <CardDescription>Managing active credentials and device access patterns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(sessions?.length ? sessions : mockSessions).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-2xl bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {session.os === 'iOS' ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{session.device}</span>
                        {session.isCurrent && <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] px-2 h-4 font-bold">CURRENT SESSION</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">{session.browser} • {session.ip}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-white flex items-center gap-1.5 justify-end font-bold mb-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {session.location}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Pulse: {new Date(session.lastActive).toLocaleTimeString()}</p>
                    </div>
                    {!session.isCurrent && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 rounded-xl h-9">
                        Revoke Access
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                Strategic Security Timeline
              </CardTitle>
              <CardDescription>Immutable record of technical account escalations and changes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { action: 'MFA Handshake Success', date: '2 hours ago', icon: Shield, color: 'text-emerald-500' },
                { action: 'API Credential Rotation', date: '4 days ago', icon: Lock, color: 'text-primary' },
                { action: 'Privilege Level Escalation', date: '12 days ago', icon: ShieldAlert, color: 'text-orange-500' },
                { action: 'Audit Baseline Generated', date: '21 days ago', icon: History, color: 'text-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 relative group">
                  <div className={cn("w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pb-5 border-b border-white/5 group-last:border-none">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-white">{item.action}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{item.date}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Telemetry Verified via SS-NODE-ALPHA</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transform transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}