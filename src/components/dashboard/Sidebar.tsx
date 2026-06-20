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
  ShieldCheck,
  Globe,
  Target,
  FileBadge,
  ChevronRight,
  Activity,
  Box,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Command Center', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Asset Perimeter', icon: Shield, href: '/assets' },
  { label: 'Scan Engines', icon: Zap, href: '/scans' },
  { label: 'Vulnerability Hub', icon: AlertOctagon, href: '/vulnerabilities' },
  { label: 'Threat Intelligence', icon: Globe, href: '/threat-intel' },
  { label: 'Risk Matrix', icon: Target, href: '/risk' },
  { label: 'Compliance GRC', icon: FileBadge, href: '/compliance' },
  { label: 'Security Ops AI', icon: Bot, href: '/ai-assistant' },
  { label: 'Audit Reports', icon: FileText, href: '/reports' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { auth } = useAuth();

  return (
    <aside className="w-72 border-r border-white/5 h-screen sticky top-0 flex flex-col bg-[#020617]/95 backdrop-blur-3xl z-50">
      <div className="p-8 pb-10">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-xl cyber-gradient flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-105 transition-all duration-500">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold tracking-tight text-white group-hover:text-glow-primary transition-all">
              SecureScan
            </h1>
            <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.3em] -mt-1">Enterprise</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        <div className="pb-4 px-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Intelligence Hub</p>
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <item.icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="font-semibold text-[13px] tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                />
              )}
              {!isActive && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 -translate-x-1 group-hover:translate-x-0 transition-all" />}
            </Link>
          );
        })}

        <div className="pt-8 pb-4 px-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Governance</p>
        </div>

        {[
          { label: 'Governance Controls', icon: Fingerprint, href: '/admin' },
          { label: 'Analyst Profile', icon: User, href: '/profile' },
          { label: 'Platform Settings', icon: Settings, href: '/settings' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200",
              pathname === item.href ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
            )}
          >
            <item.icon className="w-4.5 h-4.5" />
            <span className="font-semibold text-[13px] tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white">System Status</p>
              <p className="text-[9px] text-emerald-500/80">All Nodes Operational</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all group font-bold text-sm"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}