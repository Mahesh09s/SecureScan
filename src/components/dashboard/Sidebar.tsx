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
  FileBadge,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
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

export function Sidebar() {
  const pathname = usePathname();
  const { auth } = useAuth();

  return (
    <aside className="w-72 border-r border-white/5 h-screen sticky top-0 flex flex-col bg-[#0a0a0a]/80 backdrop-blur-2xl z-50">
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl cyber-gradient flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Shield className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold tracking-tight text-white group-hover:text-glow-primary transition-all">
              SecureScan
            </h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] -mt-1 opacity-80">Enterprise</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        <div className="pb-4 px-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Intelligence Center</p>
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="font-semibold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                />
              )}
              {!isActive && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />}
            </Link>
          );
        })}

        <div className="pt-8 pb-4 px-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">System Management</p>
        </div>

        {[
          { label: 'Analyst Profile', icon: User, href: '/profile' },
          { label: 'Security Controls', icon: ShieldCheck, href: '/settings' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300",
              pathname === item.href ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.01]">
        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3.5 w-full px-5 py-4 rounded-2xl text-destructive hover:bg-destructive/10 transition-all group font-bold text-sm"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}