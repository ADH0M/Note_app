'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotFoundBoundaryProps {
  resourceName?: string;
  message?: string;
  onRetry?: () => void;
}

export function NotFoundBoundary({ 
  resourceName = 'resource', 
  message = 'The requested resource could not be found.',
  onRetry 
}: NotFoundBoundaryProps) {
  useEffect(() => {
    console.warn(`404: ${resourceName} not found`);
  }, [resourceName]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-5">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} Not Found
          </h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          <Link href="/">
            <Button size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}