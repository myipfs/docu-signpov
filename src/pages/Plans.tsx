
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { toast } from '@/utils/toast';

const Plans = () => {
  const navigate = useNavigate();
  const { session, user } = useSession();
  
  const handleUpgrade = () => {
    if (!session) {
      navigate('/auth', { state: { returnTo: '/plans' } });
      return;
    }
    
    // This would be connected to your payment processing system
    toast({
      title: "Coming soon",
      description: "Premium subscription functionality will be available soon!",
    });
  };
  
  const handleGetStarted = () => {
    if (!session) {
      navigate('/auth', { state: { returnTo: '/dashboard' } });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose Your <span className="text-gradient">Plan</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Start signing documents for free or upgrade for additional storage and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="glass-card border-2 border-primary/10">
              <CardHeader>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Free Forever
                </div>
                <CardTitle className="text-3xl font-bold">Free</CardTitle>
                <CardDescription>Get started with essential features</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$0</div>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>500MB storage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic document templates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>5 signature requests per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleGetStarted} 
                  variant="outline" 
                  className="w-full"
                >
                  {session ? "Go to Dashboard" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Premium Plan */}
            <Card className="glass-card border-2 border-primary relative">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <div className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  Recommended
                </div>
              </div>
              
              <CardHeader>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Premium
                </div>
                <CardTitle className="text-3xl font-bold">Premium</CardTitle>
                <CardDescription>Advanced features for power users</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$4.99<span className="text-lg text-foreground/70">/month</span></div>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>1GB</strong> storage (2x more than Free)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>All templates included</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited signature requests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Custom branding options</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleUpgrade} 
                  className="w-full"
                >
                  Upgrade Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Plans;
