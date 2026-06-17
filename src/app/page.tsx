"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Bot, 
  FileText, 
  ChevronRight, 
  Lock, 
  Activity, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Database, 
  ShieldAlert, 
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
  Search,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/firebase';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const dashImg = PlaceHolderImages.find(img => img.id === 'feature-dashboard');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Strategic Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl h-20 border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl cyber-gradient flex items-center justify-center shadow-xl shadow-primary/20">
              <Shield className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-headline font-bold text-white tracking-tighter">SecureScan<span className="text-primary italic">.</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Architecture', 'Intelligence', 'Compliance', 'Security'].map(item => (
              <Link key={item} href="#" className="text-[10px] font-bold text-muted-foreground hover:text-white transition-all tracking-[0.2em] uppercase">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            {currentUser ? (
              <Button asChild className="cyber-gradient rounded-xl px-8 font-bold h-11 text-white shadow-lg shadow-primary/20">
                <Link href="/dashboard">Command Center <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-[10px] font-bold text-white hover:text-primary transition-colors tracking-[0.2em] uppercase">Sign In</Link>
                <Button asChild className="cyber-gradient rounded-xl px-8 font-bold h-11 text-white shadow-lg shadow-primary/20">
                  <Link href="/register">Initialize Node</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-primary/5">
              <Zap className="w-4 h-4 fill-primary" />
              AI Vulnerability Intelligence
            </div>
            <h1 className="text-6xl lg:text-8xl font-headline font-bold text-white leading-[0.95] tracking-tighter">
              Orchestrate Your <span className="text-primary italic">Defense</span>.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
              Unified asset discovery, multi-engine auditing, and Gemini-powered remediation. Built for high-compliance engineering teams who prioritize continuous integrity.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button size="lg" className="cyber-gradient rounded-2xl px-10 text-lg h-16 font-bold text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all" asChild>
                <Link href="/register">Start Free Assessment <ArrowRight className="ml-2 w-6 h-6" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl px-10 text-lg h-16 border-white/10 hover:bg-white/5 text-white font-bold backdrop-blur-xl">
                Technical Briefing
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-8 opacity-40 grayscale filter hover:grayscale-0 hover:opacity-100 transition-all">
              {['ISO 27001', 'SOC2 TYPE II', 'NIST 800-53', 'PCI DSS 4.0'].map(cert => (
                <span key={cert} className="text-[10px] font-black tracking-[0.4em] text-white whitespace-nowrap">{cert}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10 glass-card rounded-[2.5rem] overflow-hidden p-3 bg-white/[0.02]">
              <Image 
                src={dashImg?.imageUrl || ''} 
                width={1000} 
                height={750} 
                alt="SecureScan Dashboard" 
                data-ai-hint="cybersecurity dashboard"
                className="w-full h-auto rounded-[2rem] shadow-2xl"
              />
            </div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Statistics */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01] backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'ASSETS ANALYZED', val: '24M+' },
            { label: 'CVE SYNC RATE', val: '99.9%' },
            { label: 'REMEDIATION SPEED', val: '4X' },
            { label: 'UPTIME SLA', val: '99.99%' },
          ].map((stat, i) => (
            <motion.div key={i} {...fadeInUp} className="text-center space-y-4">
              <p className="text-5xl font-headline font-bold text-white tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-black text-muted-foreground tracking-[0.4em] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Architecture */}
      <section className="py-40 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-5xl font-headline font-bold text-white tracking-tight">Global Security Operations</h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">A unified platform for technical analysts, compliance officers, and executive stakeholders.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Global Discovery', icon: Globe, desc: 'Recursive asset mapping and categorization of your entire digital attack surface.', color: 'text-primary' },
              { title: 'Continuous Auditing', icon: Activity, desc: 'Real-time engines scanning for SQLi, XSS, and critical cloud misconfigurations.', color: 'text-emerald-500' },
              { title: 'AI Remediation', icon: Bot, desc: 'Gemini-integrated fixes. Step-by-step code-level guidance for every technical finding.', color: 'text-violet-500' },
              { title: 'Compliance GRC', icon: ShieldCheck, desc: 'Automatic mapping to OWASP Top 10, MITRE ATT&CK, and global frameworks.', color: 'text-blue-500' },
              { title: 'Role-Based Access', icon: Lock, desc: 'Enterprise-grade RBAC for analysts, auditors, and executive leadership.', color: 'text-orange-500' },
              { title: 'Immutable Auditing', icon: Database, desc: 'Persistent record-keeping of every system action for full regulatory compliance.', color: 'text-cyan-500' },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass-card p-10 border-white/5 flex flex-col items-start gap-8 group cursor-pointer transition-all duration-500"
              >
                <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white", feat.color)}>
                  <feat.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-medium">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Footer */}
      <footer className="py-24 px-8 border-t border-white/5 bg-black/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <Shield className="text-primary w-8 h-8" />
              <span className="text-3xl font-headline font-bold text-white tracking-tighter">SecureScan<span className="text-primary italic">.</span></span>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
              The premier digital integrity platform for high-compliance engineering teams. Automating defense at scale.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-white tracking-[0.4em] uppercase">Intelligence</h5>
            <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Vulnerability Scan</Link>
              <Link href="#" className="hover:text-primary transition-colors">Threat Intel</Link>
              <Link href="#" className="hover:text-primary transition-colors">Audit Reports</Link>
              <Link href="#" className="hover:text-primary transition-colors">AI Analysis</Link>
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-white tracking-[0.4em] uppercase">Operations</h5>
            <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Incident Response</Link>
              <Link href="#" className="hover:text-primary transition-colors">Compliance Hub</Link>
              <Link href="#" className="hover:text-primary transition-colors">API Docs</Link>
              <Link href="#" className="hover:text-primary transition-colors">Support Node</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">© 2024 SecureScan Technologies Corp.</p>
          <div className="flex gap-10 text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">
            <Link href="#" className="hover:text-white transition-all">Privacy Protocol</Link>
            <Link href="#" className="hover:text-white transition-all">Service Terms</Link>
            <Link href="#" className="hover:text-white transition-all">SLA Agreement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
