
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';
import { useStorageLimit } from '@/hooks/useStorageLimit';

const Header = () => {
  const { session } = useSession();
  const isAuthenticated = !!session?.user;
  const { isPremium } = useStorageLimit();

  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-bold text-lg flex items-center">
          <img 
            src="/lovable-uploads/edcfe325-57db-4751-994f-524a88e0def9.png" 
            alt="SignPov" 
            className="h-8 mr-2" 
          />
          <span>SignPov</span>
          {isPremium && (
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Premium
            </span>
          )}
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/templates">Templates</Link>
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" asChild>
              <Link to="/my-documents">My Documents</Link>
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link to="/sign-documents">Sign Documents</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/contact">Contact</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth">
              {isAuthenticated ? 'Sign Out' : 'Sign In'}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
