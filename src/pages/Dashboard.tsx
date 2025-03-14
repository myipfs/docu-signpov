
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentCard from '@/components/DocumentCard';
import DocumentUploader from '@/components/DocumentUploader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/utils/toast';

// Mock data for documents but remove the readonly constraint
const demoDocuments = [
  {
    id: '1',
    title: 'Employment Contract',
    date: 'May 10, 2023',
    status: 'completed',
    signers: [
      { name: 'John Doe', status: 'signed' },
      { name: 'Jane Smith', status: 'signed' }
    ]
  },
  {
    id: '2',
    title: 'NDA Agreement',
    date: 'Jun 15, 2023',
    status: 'waiting',
    signers: [
      { name: 'John Doe', status: 'signed' },
      { name: 'Alice Brown', status: 'waiting' }
    ]
  },
  {
    id: '3',
    title: 'Consulting Agreement',
    date: 'Jul 22, 2023',
    status: 'draft',
    signers: []
  }
];

const Dashboard = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState(demoDocuments);
  const [filter, setFilter] = useState('all');

  const handleUploadComplete = (file: File) => {
    // Add new document to state
    const newDocument = {
      id: String(documents.length + 1),
      title: file.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'draft',
      signers: []
    };
    
    setDocuments([...documents, newDocument]);
    setIsUploadModalOpen(false);
    
    // Redirect to signing page
    setTimeout(() => {
      window.location.href = `/sign/${newDocument.id}`;
    }, 1000);
  };

  const filteredDocuments = filter === 'all' 
    ? documents 
    : documents.filter(doc => doc.status === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Document Dashboard</h1>
              <p className="text-foreground/70">Manage and track all your documents</p>
            </div>
            <Button 
              className="mt-4 sm:mt-0 rounded-lg"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          </div>
          
          <div className="glass-card rounded-xl shadow-sm mb-8 overflow-hidden">
            <div className="flex overflow-x-auto border-b">
              <button 
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-foreground'}`}
                onClick={() => setFilter('all')}
              >
                All Documents
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${filter === 'draft' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-foreground'}`}
                onClick={() => setFilter('draft')}
              >
                Drafts
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${filter === 'waiting' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-foreground'}`}
                onClick={() => setFilter('waiting')}
              >
                Awaiting Signatures
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${filter === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-foreground'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
          
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  id={doc.id}
                  title={doc.title}
                  date={doc.date}
                  status={doc.status}
                  signers={doc.signers}
                  className="animate-fade-up"
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-xl text-center">
              <svg 
                className="w-16 h-16 mx-auto text-foreground/30 mb-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <h3 className="text-xl font-medium mb-2">No documents found</h3>
              <p className="text-foreground/60 mb-6">
                {filter === 'all' 
                  ? "You don't have any documents yet." 
                  : `You don't have any ${filter} documents.`}
              </p>
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                className="rounded-lg"
              >
                Upload Your First Document
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Upload Document Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to sign or send for signatures.
            </DialogDescription>
          </DialogHeader>
          <DocumentUploader onUploadComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
