
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { TempEmailManager } from "@/components/TempEmailManager";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StorageUsage from '@/components/StorageUsage';
import { useStorageLimit } from '@/hooks/useStorageLimit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function Dashboard() {
  const { session, loading } = useSession();
  const { isPremium } = useStorageLimit();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth', { state: { returnTo: '/dashboard' } });
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-8">
                {isPremium ? (
                  <TempEmailManager />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Optional Temporary Email Addresses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                        <p className="text-muted-foreground mb-4">
                          Temporary email addresses using @signpov.com domain are available with a paid subscription.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Free accounts use your real email address for all document-related communications.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div>
              <StorageUsage />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
