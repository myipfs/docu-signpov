
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Mail, Lock, Signature } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-gradient min-h-screen pt-24 pb-16 px-4 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Small subtitle with animation */}
          <div 
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 opacity-0 transform translate-y-4 transition-all duration-700 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Simple Document Signing for Everyone
          </div>

          {/* Title with animation delay */}
          <h1 
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6 opacity-0 transform translate-y-4 transition-all duration-700 delay-100 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            Sign Documents <span className="text-gradient">Forever Free</span> and Securely
          </h1>

          {/* Updated description with temporary email highlight */}
          <p 
            className={cn(
              "text-lg text-foreground/80 max-w-2xl mb-8 text-balance opacity-0 transform translate-y-4 transition-all duration-700 delay-200 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            Create, upload, and sign documents with our no-cost platform. Use temporary emails for enhanced privacy when sharing and receiving signed documents.
          </p>

          {/* CTA buttons with animation delay */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-4 mb-16 opacity-0 transform translate-y-4 transition-all duration-700 delay-300 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            <Button asChild size="lg" className="rounded-lg px-8 shadow-lg bg-primary hover:bg-primary/90">
              <Link to="/dashboard">Try for free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg px-8">
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>

          {/* Enhanced Preview Image */}
          <div 
            className={cn(
              "w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border opacity-0 transform translate-y-4 transition-all duration-1000 delay-400 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            <div className="relative w-full bg-gray-50 rounded-t-xl p-2 border-b flex items-center">
              <div className="flex space-x-2 absolute left-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="w-full text-xs text-center text-gray-500">Document Signing Interface</div>
            </div>
            <div className="w-full bg-white p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Document Header */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium">Contract_Document.pdf</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>Using temp-****@signdocs.temp</span>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="space-y-4">
                  <div className="h-8 bg-gray-100 w-2/3 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>

                {/* Signature Area */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Signature Box */}
                  <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 relative bg-primary/5">
                    <div className="absolute -top-3 left-4 bg-white px-2 text-xs text-foreground/50 flex items-center gap-1">
                      <Signature className="w-3 h-3" />
                      <span>Your Signature</span>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-40 h-12 mx-auto border-b-2 border-primary/30"></div>
                      <p className="text-xs text-primary/60">Click to sign here</p>
                    </div>
                  </div>

                  {/* Privacy Features */}
                  <div className="space-y-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-primary" />
                      </div>
                      <span>End-to-end encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-3 h-3 text-primary" />
                      </div>
                      <span>Temporary email protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse">
        <span className="text-xs text-foreground/60 mb-2">Scroll to learn more</span>
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L10 9L19 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
