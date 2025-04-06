
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { TempEmailManager } from "@/components/TempEmailManager";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StorageUsage from '@/components/StorageUsage';

export default function Dashboard() {
  const { session, loading } = useSession();
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
                <TempEmailManager />
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
