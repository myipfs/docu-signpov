
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b py-4 px-4 bg-background">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">DocuSign</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/dashboard">
              My Documents
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
