import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, FileText, Edit, Send } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const SignDocuments = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  const handleUploadDocument = () => {
    // Redirect to quick sign for uploading and signing documents
    navigate('/quick-sign');
  };
  
  const handleQuickSign = () => {
    navigate('/quick-sign');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Sign <span className="text-gradient">Documents</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Fast, secure, and legally binding electronic signatures for all your documents
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="glass-card border-2 border-primary/10 hover:border-primary/30 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Sign a Document</CardTitle>
                <CardDescription>Upload a document that needs to be signed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center py-8">
                  <FileUp className="h-16 w-16 text-primary" />
                </div>
                <Button onClick={handleUploadDocument} className="w-full">
                  Upload Document
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-2 border-primary/10 hover:border-primary/30 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Sign</CardTitle>
                <CardDescription>Instantly sign a document without account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center py-8">
                  <Edit className="h-16 w-16 text-primary" />
                </div>
                <Button onClick={handleQuickSign} variant="outline" className="w-full">
                  Quick Sign
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Upload</h3>
                <p className="text-foreground/70">
                  Upload the document that needs to be signed in PDF, Word, or image format
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Edit className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Sign</h3>
                <p className="text-foreground/70">
                  Add your signature using our easy drawing pad, typing, or upload options
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Send</h3>
                <p className="text-foreground/70">
                  Download your signed document or send it to others for additional signatures
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignDocuments;
