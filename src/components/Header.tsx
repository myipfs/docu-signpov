import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';

const Header = () => {
  const { session } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-bold text-lg">
          Document Maker
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
            <Link to="/signature">Sign Documents</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
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
