
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Bell, 
  Globe, 
  Plus, 
  Trash2, 
  Fingerprint, 
  Smartphone,
  Mail,
  Zap,
  RefreshCcw,
  Copy
} from 'lucide-react';
import { useAuth, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit-logger';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // API Keys Query
  const keysQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, `users/${currentUser.uid}/apiKeys`), orderBy('createdAt', 'desc'));
  }, [firestore, currentUser]);
  const { data: apiKeys } = useCollection<any>(keysQuery);

  const generateApiKey = async () => {
    if (!firestore || !currentUser) return;
    try {
      const keyName = `key_${Math.random().toString(36).substring(7)}`;
      const prefix = "ss_live_";
      const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
      
      await addDoc(collection(firestore, `users/${currentUser.uid}/apiKeys`), {
        name: keyName,
        prefix,
        lastFour,
        revoked: false,
        createdAt: serverTimestamp(),
        expiresAt: null,
        scopes: ["scans:read", "assets:read"]
      });

      toast({ title: "API Key Generated", description: "Machine access granted for " + keyName });
      logAuditEvent(currentUser.uid, currentUser.email!, 'SETTINGS_CHANGE', `Generated API Key ${keyName}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to generate key" });
    }
  };

  const revokeKey = async (id: string) => {
    if (!firestore || !currentUser) return;
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/apiKeys`, id));
    toast({ title: "Key Revoked" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          Security Settings
        </h2>
        <p className="text-muted-foreground">Manage your identity, authentication methods, and platform access.</p>
      </div>

      <Tabs defaultValue="auth" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 w-full justify-start overflow-x-auto">
          <TabsTrigger value="auth" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Lock className="w-4 h-4" /> Authentication
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Key className="w-4 h-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="notifs" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="general" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
            <Globe className="w-4 h-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Multi-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-white">Authenticator App</p>
                      <p className="text-[10px] text-muted-foreground">Use Google Authenticator or Authy.</p>
                    </div>
                  </div>
                  <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold text-white">Email Codes</p>
                      <p className="text-[10px] text-muted-foreground">Receive 6-digit backup codes via email.</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Legacy</Badge>
                </div>
                <Button variant="outline" className="w-full border-white/10 gap-2">
                  <Fingerprint className="w-4 h-4" /> Configure WebAuthn / FIDO2
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Password Policy</CardTitle>
                <CardDescription>Update your credentials regularly for better security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                </div>
                <Button className="w-full cyber-gradient border-none">Update Password</Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Minimum 12 characters, including symbols and numbers.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Key Management</CardTitle>
                <CardDescription>Securely access the SecureScan API for automated tasks.</CardDescription>
              </div>
              <Button onClick={generateApiKey} className="cyber-gradient border-none rounded-xl gap-2 h-10 px-4">
                <Plus className="w-4 h-4" /> Create Key
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiKeys?.map((key: any) => (
                  <div key={key.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{key.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{key.prefix}••••{key.lastFour}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {key.scopes.map((s: string) => (
                          <Badge key={s} variant="secondary" className="text-[8px] bg-white/5 border-white/10 text-muted-foreground">{s}</Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white"><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => revokeKey(key.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
                {(!apiKeys || apiKeys.length === 0) && (
                  <div className="text-center py-10 opacity-30 italic text-sm">No active API keys found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
