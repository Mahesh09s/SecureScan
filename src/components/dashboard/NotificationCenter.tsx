
"use client";

import { useState, useMemo } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X,
  Trash2,
  Clock
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, useFirestore, useCollection } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter() {
  const { currentUser } = useAuth();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);

  const notificationsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, currentUser]);

  const { data: notifications, loading } = useCollection<any>(notificationsQuery);

  const unreadCount = useMemo(() => 
    notifications?.filter(n => !n.read).length || 0
  , [notifications]);

  const markAsRead = async (id: string) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'notifications', id), { read: true });
  };

  const markAllRead = async () => {
    if (!firestore || !currentUser) return;
    const batch = writeBatch(firestore);
    const unread = notifications?.filter(n => !n.read) || [];
    unread.forEach(n => {
      batch.update(doc(firestore, 'notifications', n.id), { read: true });
    });
    await batch.commit();
  };

  const deleteNotification = async (id: string) => {
    if (!firestore) return;
    await deleteDoc(doc(firestore, 'notifications', id));
  };

  const clearAll = async () => {
    if (!firestore || !currentUser) return;
    const snapshot = await getDocs(notificationsQuery!);
    const batch = writeBatch(firestore);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white rounded-full">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px] border-2 border-background">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-card border-l border-white/10 text-white w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </SheetTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllRead} className="text-[10px] text-primary hover:text-primary/80 h-auto p-0 px-2">
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={clearAll} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground animate-pulse">Synchronizing alerts...</div>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-4 rounded-xl border transition-all group relative",
                    notif.read ? "bg-white/5 border-white/5 opacity-70" : "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5"
                  )}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      notif.type === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                      notif.type === 'error' ? "bg-destructive/10 text-destructive" :
                      "bg-primary/10 text-primary"
                    )}>
                      {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                       notif.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                       <Info className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1 pr-6">
                      <p className="text-sm font-bold text-white">{notif.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1">
                        <Clock className="w-3 h-3" />
                        {notif.createdAt && formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                <Bell className="w-12 h-12" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
