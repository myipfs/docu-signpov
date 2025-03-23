
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TempEmailManager } from '@/components/TempEmailManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';

const EmailSettings: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4 md:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Email Settings</h1>
          <p className="text-muted-foreground">Configure how you receive signed documents</p>
        </div>

        <Tabs defaultValue="default" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="default">Default Emails</TabsTrigger>
            <TabsTrigger value="temporary">Temporary Emails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Using Your Regular Email</CardTitle>
                <CardDescription>
                  Receive documents directly to your regular email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-700 mb-1">Default Option</p>
                    <p className="text-sm text-blue-800">
                      When sending documents for signature, your regular email will be used 
                      by default. No setup needed - simply use the application normally.
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  Your regular email address will be used for all document communications unless 
                  you specifically choose to use a temporary email for a particular document.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Benefits of using your regular email:</h3>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Simpler setup - no additional configuration needed</li>
                    <li>All communication remains in your primary inbox</li>
                    <li>No need to monitor multiple email addresses</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="temporary" className="space-y-6">
            <TempEmailManager />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default EmailSettings;
