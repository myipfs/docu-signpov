
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/utils/toast';
import { SignaturePad } from '@/components/SignaturePad';

const SignDocument = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documentData, setDocumentData] = useState<{ title: string } | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Simulate loading document data
    const timer = setTimeout(() => {
      setDocumentData({
        title: 'Document #' + id
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleSignatureCreate = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    setIsSignatureModalOpen(false);
  };
  
  const handleSubmitDocument = () => {
    if (!signature) {
      toast.error('Please sign the document before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Document signed successfully!');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-foreground/70">Loading document...</p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Document Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">{documentData?.title}</h1>
              <p className="text-foreground/70 text-sm">Ready for signing</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                variant="outline" 
                className="rounded-lg"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                className="rounded-lg"
                onClick={signature ? handleSubmitDocument : () => setIsSignatureModalOpen(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : signature ? 'Submit Document' : 'Sign Document'}
              </Button>
            </div>
          </div>
          
          {/* Document Preview */}
          <div className="glass-card p-4 rounded-xl overflow-hidden mb-8">
            <div className="bg-white rounded-lg p-8 min-h-[80vh] flex items-center justify-center">
              <div className="max-w-xl w-full mx-auto">
                <div className="space-y-6">
                  <div className="w-full h-16 bg-gray-100 rounded-lg"></div>
                  <div className="w-2/3 h-8 bg-gray-100 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    <div className="w-4/6 h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                  </div>
                  
                  {/* Signature Field */}
                  <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 mt-12 relative">
                    {signature ? (
                      <img 
                        src={signature} 
                        alt="Your signature" 
                        className="max-h-16 mx-auto"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-primary/60 font-medium">Sign Here</p>
                        <p className="text-xs text-foreground/50 mt-1">Click the "Sign Document" button</p>
                      </div>
                    )}
                    <div className="absolute -top-3 left-4 bg-white px-2 text-xs text-foreground/50">
                      Your Signature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Use the proper SignaturePad component */}
      <SignaturePad 
        open={isSignatureModalOpen} 
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureCreate}
        initialName=""
      />
    </div>
  );
};

export default SignDocument;
