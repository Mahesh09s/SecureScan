
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Bot, FileText, ChevronRight, Lock, Activity, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const dashImg = PlaceHolderImages.find(img => img.id === 'feature-dashboard');

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass h-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl cyber-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-headline font-bold text-white tracking-tight">SecureScan</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Solutions', 'Features', 'Compliance', 'Pricing'].map(item => (
              <Link key={item} href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Button asChild className="cyber-gradient rounded-full px-6">
                <Link href="/dashboard">Enter Console <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white hover:opacity-80 transition-opacity">Sign In</Link>
                <Button asChild className="cyber-gradient rounded-full px-6">
                  <Link href="/register">Start Scanning</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-primary" />
              Vulnerability Intelligence
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold text-white leading-[1.1]">
              Automate Your <span className="text-primary italic">Security</span> Perimeter
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Unify asset discovery, automated scanning, and AI-powered remediation into a single, cohesive command center. Build for scale, secure for the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="cyber-gradient rounded-full px-8 text-lg h-14" asChild>
                <Link href="/register">Deploy Free Node <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-14 border-white/10 hover:bg-white/5">
                View Demo Report
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 grayscale opacity-50">
              {['TRUSTED BY', 'SOC2', 'HIPAA', 'ISO27001'].map(logo => (
                <span key={logo} className="text-[10px] font-bold tracking-[0.2em]">{logo}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20">
              <Image 
                src={dashImg?.imageUrl || ''} 
                width={800} 
                height={600} 
                alt="SecureScan Dashboard" 
                data-ai-hint="security dashboard"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'ASSETS SECURED', val: '2.4M+' },
            { label: 'DAILY SCANS', val: '850K' },
            { label: 'VULNS DETECTED', val: '12M' },
            { label: 'UPTIME', val: '99.99%' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl font-headline font-bold text-white">{stat.val}</p>
              <p className="text-xs font-bold text-muted-foreground tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-headline font-bold text-white">Engineered for Security Teams</h2>
            <p className="text-muted-foreground leading-relaxed">Everything you need to manage your attack surface, integrated from day one.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Asset Discovery', icon: Globe, desc: 'Automatically map and categorize every digital property in your ecosystem.' },
              { title: 'Continuous Scanning', icon: Activity, desc: 'Deploy automated engines to find SQLi, XSS, and misconfigurations in real-time.' },
              { title: 'AI Remediation', icon: Bot, desc: 'Let Gemini write your fixes. Get code-level guidance for every vulnerability identified.' },
              { title: 'Enterprise Reports', icon: FileText, desc: 'Generate compliance-ready PDF/CSV reports with a single click.' },
              { title: 'RBAC Controls', icon: Lock, desc: 'Granular access control for analysts, admins, and executive viewers.' },
              { title: 'Cloud Native', icon: Shield, desc: 'Built for modern infrastructure with seamless API and CI/CD integration.' },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8 border-white/5 flex flex-col items-start gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <feat.icon className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto glass-card p-12 lg:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 cyber-gradient opacity-50"></div>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-white">Secure Your Infrastructure <br/>in Minutes</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Join thousands of security professionals using SecureScan to stay ahead of the threat landscape.</p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="cyber-gradient rounded-full px-12 h-14 text-lg" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Shield className="text-primary w-6 h-6" />
            <span className="text-xl font-headline font-bold text-white">SecureScan</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 SecureScan Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
