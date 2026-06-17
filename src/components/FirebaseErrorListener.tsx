'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

/**
 * @fileOverview A global listener component that catches FirestorePermissionErrors 
 * and surfaces them via the toast system with technical context.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error: any) => {
      // Log technically detailed errors for debugging
      console.error('[Security Rule Violation]', error);

      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: (
          <div className="space-y-2 mt-2">
            <p className="text-xs">The security engine blocked a {error.context?.operation} request.</p>
            <div className="bg-black/20 p-2 rounded font-mono text-[9px] break-all">
              Path: {error.context?.path}
            </div>
          </div>
        ),
      });
    });

    return () => unsubscribe();
  }, [toast]);

  return null;
}
