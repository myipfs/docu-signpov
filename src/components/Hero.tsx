
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
            Sign Documents <span className="text-gradient">Beautifully</span> and Securely
          </h1>

          {/* Description with animation delay */}
          <p 
            className={cn(
              "text-lg text-foreground/80 max-w-2xl mb-8 text-balance opacity-0 transform translate-y-4 transition-all duration-700 delay-200 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            Create, upload, and sign documents with a beautifully designed platform that makes document signing a delightful experience. No subscriptions required.
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

          {/* Preview Image with animation delay */}
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
              <div className="w-full text-xs text-center text-gray-500">Signpov Interface</div>
            </div>
            <div className="w-full aspect-[16/9] bg-white p-8 flex items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="w-full h-12 bg-gray-100 rounded-lg mb-4"></div>
                <div className="w-2/3 h-8 bg-gray-100 rounded-lg mb-8"></div>
                <div className="space-y-3 mb-8">
                  <div className="w-full h-4 bg-gray-100 rounded"></div>
                  <div className="w-full h-4 bg-gray-100 rounded"></div>
                  <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                  <div className="w-full h-4 bg-gray-100 rounded"></div>
                </div>
                <div className="w-40 h-16 bg-primary/10 border-2 border-dashed border-primary/40 rounded-lg flex items-center justify-center mx-auto">
                  <div className="text-xs text-primary/60 font-medium">Sign Here</div>
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
