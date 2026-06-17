
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Shield, 
  Search, 
  AlertOctagon, 
  FileText, 
  Settings, 
  User, 
  Bot,
  Zap,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Assets', icon: Shield, href: '/assets' },
  { label: 'Scans', icon: Zap, href: '/scans' },
  { label: 'Vulnerabilities', icon: AlertOctagon, href: '/vulnerabilities' },
  { label: 'AI Assistant', icon: Bot, href: '/ai-assistant' },
  { label: 'Reports', icon: FileText, href: '/reports' },
];

const secondaryNav = [
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Security', icon: ShieldCheck, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, auth } = useAuth();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser || !firestore) return;
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [currentUser, firestore]);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 flex flex-col glass backdrop-blur-xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg cyber-gradient flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-headline font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            SecureScan
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-4">
              <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Administration</p>
            </div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all duration-200",
                pathname === '/admin' 
                  ? "bg-destructive/10 text-destructive border border-destructive/20 shadow-lg shadow-destructive/5" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-medium text-sm">Admin Panel</span>
              </div>
            </Link>
          </>
        )}

        <div className="pt-4 pb-2 px-4">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Settings</p>
        </div>

        {secondaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-200",
              pathname === item.href && "bg-primary/10 text-primary"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
