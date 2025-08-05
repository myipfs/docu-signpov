
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';
import { useStorageLimit } from '@/hooks/useStorageLimit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';

const Header = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const isAuthenticated = !!session?.user;
  const { isPremium } = useStorageLimit();
  
  // Check if user is admin (support@signpov.com or signpov@gmail.com)
  const isAdmin = session?.user?.email === 'support@signpov.com' || session?.user?.email === 'signpov@gmail.com';

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await supabase.auth.signOut();
        toast.success("Successfully signed out");
        navigate('/');
      } catch (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out. Please try again.");
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/edcfe325-57db-4751-994f-524a88e0def9.png" 
            alt="SignPov" 
            className="h-16" 
          />
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
          <Button variant="ghost" asChild>
            <Link to="/ai-templates">🤖 AI Pro</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/bank-converter">📊 Bank Converter</Link>
          </Button>
          {isAuthenticated && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/my-documents">My Documents</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
            </>
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
          <Button variant="outline" onClick={handleAuthAction}>
            {isAuthenticated ? 'Sign Out' : 'Sign In'}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
