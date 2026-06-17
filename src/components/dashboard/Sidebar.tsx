"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Shield, 
  AlertOctagon, 
  FileText, 
  Settings, 
  User, 
  Bot,
  Zap,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Target,
  FileBadge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Executive Command', icon: LayoutDashboard, href: '/' },
  { label: 'Asset Inventory', icon: Shield, href: '/assets' },
  { label: 'Scan Engine', icon: Zap, href: '/scans' },
  { label: 'Vulnerabilities', icon: AlertOctagon, href: '/vulnerabilities' },
  { label: 'Threat Intel', icon: Globe, href: '/threat-intel' },
  { label: 'Risk Matrix', icon: Target, href: '/risk' },
  { label: 'Compliance GRC', icon: FileBadge, href: '/compliance' },
  { label: 'AI Security Assistant', icon: Bot, href: '/ai-assistant' },
  { label: 'Assessment Reports', icon: FileText, href: '/reports' },
];

const secondaryNav = [
  { label: 'Analyst Profile', icon: User, href: '/profile' },
  { label: 'Security Controls', icon: ShieldCheck, href: '/settings' },
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
    <aside className="w-64 border-r border-border h-screen sticky top-0 flex flex-col glass backdrop-blur-xl z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl cyber-gradient flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              SecureScan
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] -mt-1">Enterprise</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto scrollbar-hide">
        <div className="pb-2 px-4">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Tactical Center</p>
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && <motion.div layoutId="sidebar-active" className="w-1 h-4 bg-primary rounded-full" />}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-6 pb-2 px-4">
              <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Governance</p>
            </div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200",
                pathname === '/admin' 
                  ? "bg-destructive/10 text-destructive border border-destructive/20 shadow-lg shadow-destructive/5" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-medium text-sm">Admin Control</span>
              </div>
            </Link>
          </>
        )}

        <div className="pt-6 pb-2 px-4">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Configuration</p>
        </div>

        {secondaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-200",
              pathname === item.href && "bg-primary/10 text-primary"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-border mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Sign Out Engine</span>
        </button>
      </div>
    </aside>
  );
}