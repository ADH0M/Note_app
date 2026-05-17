'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen h-screen bg-background flex  justify-center overflow-y-auto">
      <div className="max-w-2xl w-full text-center space-y-4 pb-10 ">
        {/* Animated 404 (without motion, just subtle CSS) */}
        <div className="relative">
          <div className="text-[100px] sm:text-[200px] font-bold font-serif italic
           leading-none bg-linear-to-r from-primary/80 to-primary/20 bg-clip-text
            text-transparent">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Compass className="w-40 h-40" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you&#39;re looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            You might be looking for:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/" className="group">
              <div className="p-3 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors text-left">
                <Home className="w-4 h-4 text-primary mb-2" />
                <p className="font-medium text-foreground text-sm">Home</p>
                <p className="text-xs text-muted-foreground">Back to dashboard</p>
              </div>
            </Link>
            <Link href="/ai-hub" className="group">
              <div className="p-3 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors text-left">
                <Sparkles className="w-4 h-4 text-primary mb-2" />
                <p className="font-medium text-foreground text-sm">AI Hub</p>
                <p className="text-xs text-muted-foreground">AI productivity tools</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link href="/">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          If you believe this is an error, please check the URL or contact support.
        </p>
      </div>
    </div>
  );
}