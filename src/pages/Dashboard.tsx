
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
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
          
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <StorageUsage />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
