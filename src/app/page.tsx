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
  Fingerprint
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
            {['Intelligence', 'Architecture', 'Compliance', 'Pricing'].map(item => (
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
              
              {/* Dynamic Overlay Components */}
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

      {/* Feature Architecture: Elite Operations */}
      <section id="architecture" className="py-48 px-8 relative">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] font-bold text-[10px] px-6 py-2 rounded-full">The Architecture of Defense</Badge>
            <h2 className="text-6xl font-headline font-bold text-white tracking-tighter">Built for High-Compliance Engineering.</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">SecureScan orchestrates professional security tools into a unified, actionable telemetry stream.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: 'Asset Discovery', icon: SearchCode, desc: 'Continuous, recursive mapping of your authorized digital surface across web and cloud.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { title: 'Multi-Engine Audit', icon: Activity, desc: 'Parallel execution of Nuclei, OWASP ZAP, and Vuls for exhaustive technical assessment.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { title: 'AI Remediation', icon: Bot, desc: 'Gemini-integrated logic providing code-level fixes and NIST-aligned IR plans for every finding.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { title: 'GRC Mapping', icon: ShieldCheck, desc: 'Automated correlation of technical findings to OWASP Top 10, MITRE ATT&CK, and NIST CSF.', color: 'text-primary', bg: 'bg-primary/10' },
              { title: 'Identity Governance', icon: Fingerprint, desc: 'Enterprise-grade RBAC and session monitoring to ensure authorized access only.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
              { title: 'Audit Pipeline', icon: Database, desc: 'Immutable logging of all system actions for regulatory compliance and accountability.', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                whileHover={{ y: -15, scale: 1.03 }}
                className="glass-card p-12 border-white/5 flex flex-col items-start gap-10 group cursor-pointer transition-all duration-700 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]"
              >
                <div className={cn("p-5 rounded-3xl transition-all duration-500 group-hover:scale-110", feat.bg, feat.color)}>
                  <feat.icon className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium opacity-80">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works: The Pipeline */}
      <section className="py-48 px-8 border-y border-white/5 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <motion.div {...fadeInUp} className="space-y-16">
            <div className="space-y-8 text-left">
              <h2 className="text-6xl font-headline font-bold text-white tracking-tight leading-[1.1]">
                Zero to Remediation <br />
                in <span className="text-primary italic">60 Seconds.</span>
              </h2>
              <p className="text-2xl text-muted-foreground leading-relaxed font-medium opacity-80">
                Our automated workflow eliminates the latency between detection and fix.
              </p>
            </div>

            <div className="space-y-10">
              {[
                { step: '01', title: 'Asset Authorization', desc: 'SecureScan crawls and validates ownership of your digital perimeter.' },
                { step: '02', title: 'Orchestrated Audit', desc: 'Industry-standard scanners perform high-intensity telemetry extraction.' },
                { step: '03', title: 'AI Synthesis', desc: 'Gemini analyzes findings to generate step-by-step remediation plans.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-10 group">
                  <div className="text-5xl font-headline font-black text-primary/10 group-hover:text-primary transition-all duration-500">{item.step}</div>
                  <div className="space-y-3 pt-2">
                    <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                    <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="relative group">
            <div className="glass-card rounded-[3rem] p-10 space-y-8 bg-black/60 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full"></div>
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <Terminal className="w-6 h-6 text-primary" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-[0.3em]">Active Audit Node: SS-BETA</span>
                </div>
                <Badge variant="outline" className="animate-pulse bg-emerald-500/20 text-emerald-500 border-emerald-500/30 px-4 py-1">SYNCHRONIZING</Badge>
              </div>
              
              <div className="font-mono text-[11px] space-y-4 text-white/50 leading-relaxed">
                <p className="text-primary font-bold">[INITIALIZE] Engine Orchestration: Nuclei 3.0</p>
                <p>[TELEMETRY] Requesting metadata from /api/v2/secure-auth...</p>
                <p className="text-yellow-500 font-bold">[ALERT] CVE-2023-4481: Buffer Overflow detected.</p>
                <p className="text-violet-400 font-bold">[AI_AGENT] Generating exploit mitigation logic...</p>
                
                <div className="pt-8 mt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="w-5 h-5 text-violet-400" />
                    <p className="text-white font-bold text-xs">AI Remediation Fix Available:</p>
                  </div>
                  <div className="bg-black/80 p-6 rounded-2xl border border-violet-500/20 text-violet-300 font-bold shadow-inner">
                    {"// Mitigate injection via prepared statements\nconst user = await db.query(\n  'SELECT * FROM users WHERE id = $1',\n  [userId]\n);"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing: Scale for Defense */}
      <section id="pricing" className="py-48 px-8 relative">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h2 className="text-6xl font-headline font-bold text-white tracking-tight">Strategic Security Tiers</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">Choose your level of intelligence and orchestration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                name: 'Node', 
                price: '0', 
                desc: 'For independent researchers and internal testing nodes.',
                features: ['1 Authorized Asset', 'Nuclei CVE Scanning', 'Standard Scan Logs', 'Community Intel Sync'] 
              },
              { 
                name: 'Sentinel', 
                price: '499', 
                popular: true,
                desc: 'Full-spectrum auditing for scaling engineering teams.',
                features: ['10 Managed Assets', 'Gemini AI Remediation', 'Executive PDF Reports', 'Custom Scan Scheduling', '24h Vulnerability Sync'] 
              },
              { 
                name: 'Fortress', 
                price: '1,999', 
                desc: 'The complete GRC and offensive security command center.',
                features: ['Unlimited Assets', 'Full REST API & SIEM Integration', 'Custom GRC Framework Mapping', 'Dedicated Support Analyst', 'Audit Log Archiving'] 
              }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                className={cn(
                  "glass-card p-12 flex flex-col gap-12 relative group transition-all duration-700",
                  plan.popular ? "border-primary/40 shadow-[0_40px_100px_rgba(59,130,246,0.1)] ring-1 ring-white/10 scale-105 z-10" : "border-white/5"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black tracking-[0.4em] px-6 py-2 rounded-full uppercase shadow-2xl">
                    Most Recommended
                  </div>
                )}
                <div className="space-y-6">
                  <h3 className="text-3xl font-headline font-black text-white tracking-widest uppercase">{plan.name}</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-headline font-bold text-white">${plan.price}</span>
                    <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">/ Mo</span>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium opacity-80">{plan.desc}</p>
                </div>

                <div className="space-y-5 flex-1 pt-6 border-t border-white/5">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold text-white/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <Button className={cn(
                  "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all",
                  plan.popular ? "cyber-gradient text-white shadow-2xl shadow-primary/30" : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                )}>
                  Provision {plan.name} Node
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence FAQ */}
      <section className="py-48 px-8 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-headline font-bold text-white tracking-tight">Technical Intelligence FAQ</h2>
            <p className="text-xl text-muted-foreground">Detailed protocol information for analysts and CISOs.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-6">
            {[
              { q: "Is vulnerability scanning fully authorized?", a: "SecureScan is built on the principle of authorized testing. Users must prove ownership or explicit permission for any target. Every scan is cryptographically signed and logged in an immutable audit trail." },
              { q: "How does the AI remediation logic work?", a: "Our system utilizes Gemini 1.5 Pro to synthesize technical scan findings into human-readable code fixes. It analyzes the specific telemetry of your assets to ensure remediation plans are contextually accurate." },
              { q: "Can SecureScan integrate with SIEM platforms?", a: "Yes. Fortress tier users can export live telemetry to Splunk, Sentinel, and Elastic via our robust REST API and specialized connectors." },
              { q: "What frameworks are supported for GRC?", a: "We provide automated mapping to OWASP Top 10 (2021), MITRE ATT&CK, NIST CSF 2.0, and PCI DSS 4.0 within our enterprise reports." },
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
                Our security engineering team provides custom architectural reviews and deployment strategies for enterprise nodes.
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
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Corporate Identity</label>
                  <input type="text" placeholder="Authorized Contact" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secure Endpoint</label>
                  <input type="email" placeholder="official@organization.com" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mission Context</label>
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
                The premier digital integrity platform for high-compliance engineering teams. Orchestrating professional defense at global scale.
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
