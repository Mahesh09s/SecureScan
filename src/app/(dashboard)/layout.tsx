
"use client";

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Search, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';
import { useAuth } from '@/firebase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 glass sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-96">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets, vulnerabilities..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                  {currentUser?.displayName || 'Security Analyst'}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {currentUser?.email?.split('@')[0]}
                </p>
              </div>
              <Avatar className="h-8 w-8 ring-2 ring-border group-hover:ring-primary/50 transition-all">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser?.uid}/100/100`} />
                <AvatarFallback>{currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
