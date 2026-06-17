'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

/**
 * @fileOverview Global Error Boundary for catching uncaught client-side exceptions.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Exception]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-background">
      <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-headline font-bold text-white">System Exception</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          SecureScan encountered an unexpected error. Our engineering team has been notified.
        </p>
      </div>
      <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-destructive-foreground/50 max-w-lg truncate">
        {error.message || 'Unknown technical fault detected.'}
      </div>
      <Button 
        onClick={() => reset()}
        className="cyber-gradient border-none rounded-xl gap-2 h-12 px-8"
      >
        <RefreshCcw className="w-4 h-4" />
        Reload Command Center
      </Button>
    </div>
  );
}
