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
  ShieldAlert, 
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
  Search,
  LayoutGrid,
  Mail,
  MessageSquare,
  Binary,
  Flame,
  Target,
  FileBadge,
  Sparkles,
  MousePointer2,
  HardDrive,
  Database,
  SearchCode,
  FileSearch,
  ShieldQuestion,
  Fingerprint,
  LayoutDashboard,
  Bell,
  History,
  UserPlus,
  XCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useAuth } from '@/firebase';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const dashImg = PlaceHolderImages.find(img => img.id === 'feature-dashboard');

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  const enterpriseFeatures = [
    { 
      title: 'Asset Management', 
      icon: HardDrive, 
      desc: 'Manage websites, domains, servers, and IP addresses from a centralized dashboard.', 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      title: 'Vulnerability Scanning', 
      icon: SearchCode, 
      desc: 'Perform authorized security assessments and identify security weaknesses.', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      title: 'AI Security Assistant', 
      icon: Bot, 
      desc: 'Get AI-powered explanations, remediation guidance, and risk prioritization.', 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/10' 
    },
    { 
      title: 'Security Dashboard', 
      icon: LayoutDashboard, 
      desc: 'Monitor assets, vulnerabilities, compliance, and overall security posture.', 
      color: 'text-primary', 
      bg: 'bg-primary/10' 
    },
    { 
      title: 'Security Reports', 
      icon: FileBadge, 
      desc: 'Generate professional PDF, CSV, and JSON reports tailored for stakeholders.', 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-500/10' 
    },
    { 
      title: 'Compliance Monitoring', 
      icon: Target, 
      desc: 'Visualize OWASP Top 10, MITRE ATT&CK, and security best practices.', 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10' 
    },
    { 
      title: 'Notifications', 
      icon: Bell, 
      desc: 'Receive real-time alerts for scans, vulnerabilities, and security events.', 
      color: 'text-red-500', 
      bg: 'bg-red-500/10' 
    },
    { 
      title: 'Audit Logs', 
      icon: History, 
      desc: 'Track all user actions and system events for total accountability.', 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10' 
    },
    { 
      title: 'Role-Based Access', 
      icon: Fingerprint, 
      desc: 'Secure authentication with Admin, Security Analyst, and Viewer roles.', 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-500/10' 
    },
    { 
      title: 'Modern UI', 
      icon: MousePointer2, 
      desc: 'Responsive dark theme with glassmorphism, live charts, and smooth animations.', 
      color: 'text-pink-500', 
      bg: 'bg-pink-500/10' 
    },
  ];

  const workflowSteps = [
    { 
      title: 'Register Account', 
      desc: 'Initialize your operator node and configure your secure profile.', 
      icon: UserPlus,
      color: 'text-blue-500'
    },
    { 
      title: 'Add Authorized Assets', 
      desc: 'Define your perimeter by registering verified websites, servers, and IPs.', 
      icon: Shield,
      color: 'text-indigo-500'
    },
    { 
      title: 'Start Security Scan', 
      desc: 'Orchestrate professional engines like Nuclei and OWASP ZAP with one click.', 
      icon: Zap,
      color: 'text-violet-500'
    },
    { 
      title: 'Analyze Vulnerabilities', 
      desc: 'Review normalized findings categorized by severity and technical impact.', 
      icon: SearchCode,
      color: 'text-fuchsia-500'
    },
    { 
      title: 'AI Remediation', 
      desc: 'Receive NIST-aligned IR plans and secure coding fixes from Gemini.', 
      icon: Bot,
      color: 'text-rose-500'
    },
    { 
      title: 'Download Reports', 
      desc: 'Synthesize audit data into executive-grade PDF and JSON documents.', 
      icon: FileText,
      color: 'text-emerald-500'
    },
  ];

  const comparisonData = [
    { feature: "AI-Powered Analysis", ss: true, trad: false },
    { feature: "Real-Time Telemetry Dashboard", ss: true, trad: false },
    { feature: "Granular RBAC Controls", ss: true, trad: false },
    { feature: "Automated Risk Scoring", ss: true, trad: false },
    { feature: "Modern Glassmorphism UI", ss: true, trad: false },
    { feature: "Automated Compliance GRC", ss: true, trad: false },
    { feature: "Centralized Asset Perimeter", ss: true, trad: false },
    { feature: "Live Security Notifications", ss: true, trad: false },
    { feature: "Executive PDF/JSON Reports", ss: true, trad: false },
  ];

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Animated Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] -right-[10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="scanline"></div>
      </div>

      {/* Enterprise Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-3xl h-20 border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl cyber-gradient flex items-center justify-center shadow-2xl shadow-primary/30">
              <Shield className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-headline font-bold text-white tracking-tighter">SecureScan<span className="text-primary italic">.</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {['Intelligence', 'Architecture', 'Compliance', 'Access'].map(item => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold text-muted-foreground hover:text-white transition-all tracking-[0.25em] uppercase">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {currentUser ? (
              <Button asChild className="cyber-gradient rounded-xl px-8 font-bold h-11 text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Link href="/dashboard">Command Center <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-[10px] font-bold text-white hover:text-primary transition-colors tracking-[0.2em] uppercase hidden sm:block">Sign In</Link>
                <Button asChild className="cyber-gradient rounded-xl px-8 font-bold h-11 text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none">
                  <Link href="/register">Initialize Node</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero: Strategic Defense */}
      <section className="relative pt-56 pb-32 px-8 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center text-left">
          <motion.div 
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <Badge variant="outline" className="px-6 py-2 rounded-full bg-primary/10 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/5">
                <Fingerprint className="w-4 h-4 mr-3" />
                Verified Authorized Assessments
              </Badge>
              <h1 className="text-7xl lg:text-[100px] font-headline font-bold text-white leading-[0.9] tracking-tightest">
                Automate Your <br />
                <span className="text-primary italic">Digital Integrity.</span>
              </h1>
              <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl font-medium opacity-80">
                A unified command center for asset discovery, multi-engine auditing, and Gemini-powered remediation logic.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="lg" className="cyber-gradient rounded-2xl px-12 text-xl h-20 font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all border-none" asChild>
                <Link href="/register">Launch Free Scan <ArrowRight className="ml-3 w-7 h-7" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl px-12 text-xl h-20 border-white/10 hover:bg-white/5 text-white font-bold backdrop-blur-2xl transition-all">
                The Briefing
              </Button>
            </div>

            <div className="flex items-center gap-10 pt-10 border-t border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {['SOC2 TYPE II', 'NIST 800-53', 'PCI DSS 4.0', 'ISO 27001'].map(cert => (
                <span key={cert} className="text-[10px] font-black tracking-[0.4em] text-white whitespace-nowrap">{cert}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 glass-card rounded-[3rem] overflow-hidden p-3 bg-white/[0.01] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
              <Image 
                src={dashImg?.imageUrl || 'https://picsum.photos/seed/sec-dash/800/600'} 
                width={1000} 
                height={750} 
                alt="SecureScan Command Center" 
                className="w-full h-auto rounded-[2.5rem] shadow-2xl opacity-90"
              />
              
              <motion.div 
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -left-12 glass-card p-5 rounded-2xl border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Health</p>
                    <p className="text-xl font-headline font-bold text-emerald-500">GRADE: A+</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 25, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 -right-12 glass-card p-5 rounded-2xl border-destructive/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <Flame className="w-6 h-6 text-destructive" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Active Risks</p>
                    <p className="text-xl font-headline font-bold text-destructive">14 CRITICAL</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Security Features */}
      <section id="features" className="py-48 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] font-bold text-[10px] px-6 py-2 rounded-full">Platform Capabilities</Badge>
            <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">Enterprise Security Features</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">Everything required for modern vulnerability assessment and security management in one platform.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enterpriseFeatures.map((feat, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 border-white/5 flex flex-col items-start gap-8 group cursor-pointer transition-all duration-500 hover:border-primary/40 relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className={cn("absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full", feat.bg)}></div>
                
                <div className={cn("p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-lg", feat.bg, feat.color)}>
                  <feat.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3 relative z-10">
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80">{feat.desc}</p>
                </div>
                
                {/* Bottom gradient indicator */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 cyber-gradient scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works: Tactical Workflow */}
      <section id="how-it-works" className="py-48 px-8 relative bg-white/[0.01]">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] font-bold text-[10px] px-6 py-2 rounded-full">Audit Pipeline</Badge>
            <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">How SecureScan Works</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">A streamlined approach to professional vulnerability assessment.</p>
          </div>

          <div className="relative">
            {/* Connecting Timeline Line */}
            <div className="absolute top-24 left-0 w-full h-0.5 bg-white/5 hidden xl:block">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full cyber-gradient origin-left"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8 relative z-10">
              {workflowSteps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  className="flex flex-col items-center text-center gap-8 group"
                >
                  <div className="relative">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl glass-card flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
                      step.color
                    )}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    {/* Pulsing indicator node */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-[2rem] border-white/5 space-y-3 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-primary uppercase">Step 0{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{step.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium line-clamp-3">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SecureScan: Comparison Section */}
      <section id="comparison" className="py-48 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] font-bold text-[10px] px-6 py-2 rounded-full">Competitive Intelligence</Badge>
            <h2 className="text-6xl font-headline font-bold text-white tracking-tight">Why Choose SecureScan</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">A paradigm shift in automated vulnerability detection and remediation.</p>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
            <motion.div 
              {...fadeInUp}
              className="glass-card rounded-[3rem] overflow-hidden border-white/5 bg-black/20"
            >
              <div className="grid grid-cols-3 bg-white/[0.02] border-b border-white/5">
                <div className="p-8 text-xs font-black text-muted-foreground uppercase tracking-widest border-r border-white/5">Platform Feature</div>
                <div className="p-8 flex items-center gap-3 border-r border-white/5">
                  <div className="w-8 h-8 rounded-lg cyber-gradient flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-widest">SecureScan</span>
                </div>
                <div className="p-8 flex items-center gap-3 opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <History className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-widest">Legacy Tools</span>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {comparisonData.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-3 group hover:bg-white/[0.01] transition-colors">
                    <div className="p-8 text-sm font-bold text-white/80 border-r border-white/5 flex items-center">{row.feature}</div>
                    <div className="p-8 flex items-center border-r border-white/5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="p-8 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                        <XCircle className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Community Access */}
      <section id="access" className="py-48 px-8 relative">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 uppercase tracking-[0.4em] font-bold text-[10px] px-6 py-2 rounded-full">Protocol Access</Badge>
            <h2 className="text-6xl font-headline font-bold text-white tracking-tight">Open Security Intelligence</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">Free, forever-available platform for authorized security testing and education.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              {...fadeInUp}
              className="glass-card p-12 lg:p-16 flex flex-col gap-12 relative group transition-all duration-700 border-primary/40 shadow-[0_40px_100px_rgba(59,130,246,0.1)] ring-1 ring-white/10"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full uppercase shadow-2xl">
                Open Source
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4">
                  <h3 className="text-4xl font-headline font-black text-white tracking-widest uppercase">Free Community Edition</h3>
                  <p className="text-lg text-muted-foreground font-medium opacity-80 max-w-xl">
                    Built for students, researchers, cybersecurity learners, and authorized security assessments.
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-6xl font-headline font-bold text-white tracking-tighter">FREE</span>
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Life-Time Access</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-12 border-t border-white/5">
                {[
                  'Unlimited Dashboard Access', 'Asset Management', 'Vulnerability Scanning',
                  'AI Security Assistant', 'Security Reports (PDF, CSV, JSON)', 'Risk Score Dashboard',
                  'Compliance Dashboard', 'Vulnerability Management', 'Scan History',
                  'Notification Center', 'Audit Logs', 'Role-Based Authentication',
                  'Responsive Dashboard', 'Dark Theme', 'Real-Time Analytics',
                  'Educational & Research Use'
                ].map((feat, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-white/80">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-12 border-t border-white/5">
                <Button asChild className="w-full h-20 cyber-gradient text-white text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 border-none hover:scale-105 active:scale-95 transition-all">
                  <Link href="/register">Launch SecureScan <ArrowRight className="ml-3 w-7 h-7" /></Link>
                </Button>
                <p className="text-center text-muted-foreground text-sm font-medium">
                  No subscription required. Built for learning, research, and authorized security testing.
                </p>
              </div>
            </motion.div>
            
            <p className="text-center mt-12 text-muted-foreground/60 text-sm italic max-w-2xl mx-auto leading-relaxed">
              "SecureScan is intended exclusively for educational purposes and authorized security assessments. Users must obtain proper authorization before scanning any systems."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-48 px-8 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-headline font-bold text-white tracking-tight">Technical Intelligence FAQ</h2>
            <p className="text-xl text-muted-foreground">Detailed protocol information for analysts and researchers.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-6">
            {[
              { q: "Is vulnerability scanning fully authorized?", a: "SecureScan is built on the principle of authorized testing. Users must prove ownership or explicit permission for any target. Every scan is cryptographically signed and logged in an immutable audit trail." },
              { q: "How does the AI remediation logic work?", a: "Our system utilizes Gemini 1.5 Pro to synthesize technical scan findings into human-readable code fixes. It analyzes the specific telemetry of your assets to ensure remediation plans are contextually accurate." },
              { q: "Is the platform really free?", a: "Yes. The Community Edition is designed as a contribution to the cybersecurity community, supporting students and researchers in learning defensive security operations." },
              { q: "What frameworks are supported for GRC?", a: "We provide automated mapping to OWASP Top 10 (2021), MITRE ATT&CK, NIST CSF 2.0, and PCI DSS 4.0 within our reports." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass-card px-10 border-white/5 rounded-[2rem] overflow-hidden">
                <AccordionTrigger className="text-white hover:no-underline font-bold text-xl py-8 text-left group">
                  <span className="group-hover:text-primary transition-colors">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-10 opacity-80">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Strategic Contact */}
      <section id="contact" className="py-48 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-[4rem] p-24 border-white/10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-32">
            <div className="absolute top-0 left-0 w-full h-full cyber-gradient opacity-[0.04]"></div>
            <div className="space-y-10 flex-1 relative z-10 text-left">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] font-bold text-[10px] px-6 py-2 rounded-full">Protocol Access</Badge>
              <h2 className="text-7xl font-headline font-bold text-white tracking-tighter leading-tight">
                Ready to Harden Your <br />
                <span className="text-primary italic">Digital Surface?</span>
              </h2>
              <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl font-medium opacity-80">
                Our security engineering team provides support and guidance for educational research and enterprise audits.
              </p>
              <div className="flex flex-col sm:flex-row gap-12 pt-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Secure Protocol</p>
                    <p className="text-xl font-bold text-white">ops@securescan.io</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Direct Link</p>
                    <p className="text-xl font-bold text-white">+1 (888) SEC-SCAN</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[500px] relative z-10">
              <div className="glass-card p-12 rounded-[3rem] border-white/5 space-y-8 bg-black/40">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Operator Identity</label>
                  <input type="text" placeholder="Authorized Name" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secure Endpoint</label>
                  <input type="email" placeholder="official@endpoint.com" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Research Context</label>
                  <textarea placeholder="Describe your security requirements..." className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none focus:ring-1 focus:ring-primary resize-none transition-all"></textarea>
                </div>
                <Button className="w-full h-20 cyber-gradient rounded-[1.5rem] text-xl font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-primary/30 border-none hover:scale-105 active:scale-95 transition-all">
                  Transmit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="py-24 px-8 border-t border-white/5 bg-[#05050a] relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid md:grid-cols-4 gap-20">
            <div className="col-span-1 md:col-span-2 space-y-10">
              <div className="flex items-center gap-5">
                <Shield className="text-primary w-10 h-10" />
                <span className="text-4xl font-headline font-bold text-white tracking-tighter">SecureScan<span className="text-primary italic">.</span></span>
              </div>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-md opacity-80">
                The premier digital integrity platform for researchers and security teams. Orchestrating professional defense at global scale.
              </p>
              <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                 {['GDPR', 'HIPAA', 'SOC2', 'PCI'].map(badge => (
                   <span key={badge} className="text-[10px] font-black tracking-[0.4em] border border-white/30 px-4 py-1.5 rounded-full text-white">{badge}</span>
                 ))}
              </div>
            </div>
            
            <div className="space-y-8">
              <h5 className="text-[10px] font-black text-white tracking-[0.5em] uppercase opacity-40">Intelligence</h5>
              <div className="flex flex-col gap-6 text-sm font-bold text-muted-foreground">
                <Link href="/vulnerabilities" className="hover:text-primary transition-all">Vulnerability Hub</Link>
                <Link href="/threat-intel" className="hover:text-primary transition-all">Threat Intel Feed</Link>
                <Link href="/reports" className="hover:text-primary transition-all">Audit Synthesis</Link>
                <Link href="/ai-assistant" className="hover:text-primary transition-all">SecureAI Agent</Link>
              </div>
            </div>
            
            <div className="space-y-8">
              <h5 className="text-[10px] font-black text-white tracking-[0.5em] uppercase opacity-40">Operations</h5>
              <div className="flex flex-col gap-6 text-sm font-bold text-muted-foreground">
                <Link href="/compliance" className="hover:text-primary transition-all">Compliance GRC</Link>
                <Link href="/assets" className="hover:text-primary transition-all">Asset Perimeter</Link>
                <Link href="/settings" className="hover:text-primary transition-all">Control Center</Link>
                <Link href="/profile" className="hover:text-primary transition-all">Analyst Node</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50 italic">© 2024 SecureScan Technologies Corp. Built for Tactical Defense.</p>
            <div className="flex gap-12 text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase opacity-50">
              <Link href="#" className="hover:text-white transition-all">Privacy Protocol</Link>
              <Link href="#" className="hover:text-white transition-all">Terms of Engagement</Link>
              <Link href="#" className="hover:text-white transition-all">SLA Agreement</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
