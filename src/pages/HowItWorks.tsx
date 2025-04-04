
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Users, Shield, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">How <span className="text-gradient">SignPov</span> Works</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              A simple, secure platform for digital document signatures
            </p>
          </div>
          
          {/* Step by Step Process */}
          <div className="space-y-12 mb-20">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-24 left-8 h-[calc(100%+3rem)] w-0.5 bg-primary/20 hidden md:block"></div>
              
              {/* Step 1 */}
              <div className="glass-card p-8 rounded-xl relative md:ml-12 mb-12">
                <div className="absolute left-0 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full font-bold text-xl bg-primary text-white hidden md:flex">
                  1
                </div>
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 text-primary p-2 rounded-full mr-4 md:hidden">
                    <span className="font-bold text-lg">1</span>
                  </div>
                  <FileText className="h-8 w-8 text-primary mr-4" />
                  <h2 className="text-2xl font-bold">Upload or Create Your Document</h2>
                </div>
                <p className="text-foreground/80 mb-4">
                  Start by uploading an existing document or creating a new one using our templates.
                  We support all common document formats including PDF, Word, Excel, and more.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Upload</h3>
                    <p className="text-sm text-foreground/70">
                      Easily upload your existing documents using our simple drag-and-drop interface.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Create</h3>
                    <p className="text-sm text-foreground/70">
                      Use our library of templates to quickly create professional documents.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="glass-card p-8 rounded-xl relative md:ml-12 mb-12">
                <div className="absolute left-0 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full font-bold text-xl bg-primary text-white hidden md:flex">
                  2
                </div>
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 text-primary p-2 rounded-full mr-4 md:hidden">
                    <span className="font-bold text-lg">2</span>
                  </div>
                  <Users className="h-8 w-8 text-primary mr-4" />
                  <h2 className="text-2xl font-bold">Add Signature Fields & Recipients</h2>
                </div>
                <p className="text-foreground/80 mb-4">
                  Place signature fields anywhere on your document. Specify who needs to sign each field
                  and in what order. Add as many signers as you need.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Signature Fields</h3>
                    <p className="text-sm text-foreground/70">
                      Drag and drop signature, initial, date, and text fields onto your document.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Recipients</h3>
                    <p className="text-sm text-foreground/70">
                      Add recipients and assign them specific fields to complete.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="glass-card p-8 rounded-xl relative md:ml-12 mb-12">
                <div className="absolute left-0 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full font-bold text-xl bg-primary text-white hidden md:flex">
                  3
                </div>
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 text-primary p-2 rounded-full mr-4 md:hidden">
                    <span className="font-bold text-lg">3</span>
                  </div>
                  <Shield className="h-8 w-8 text-primary mr-4" />
                  <h2 className="text-2xl font-bold">Secure Sending & Signing</h2>
                </div>
                <p className="text-foreground/80 mb-4">
                  Send your document securely to all recipients. They'll receive email notifications
                  with a secure link to view and sign the document. No account required for signers!
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Secure Delivery</h3>
                    <p className="text-sm text-foreground/70">
                      Documents are sent via secure links with optional password protection.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Easy Signing</h3>
                    <p className="text-sm text-foreground/70">
                      Recipients can sign from any device without creating an account.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="glass-card p-8 rounded-xl relative md:ml-12">
                <div className="absolute left-0 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full font-bold text-xl bg-primary text-white hidden md:flex">
                  4
                </div>
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 text-primary p-2 rounded-full mr-4 md:hidden">
                    <span className="font-bold text-lg">4</span>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary mr-4" />
                  <h2 className="text-2xl font-bold">Track & Download</h2>
                </div>
                <p className="text-foreground/80 mb-4">
                  Monitor the status of your documents in real-time. Get notified when recipients view
                  or sign. Once complete, download the signed document with a detailed audit trail.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Real-time Tracking</h3>
                    <p className="text-sm text-foreground/70">
                      See when documents are viewed, signed, or declined in real-time.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Completed Documents</h3>
                    <p className="text-sm text-foreground/70">
                      Download completed documents with signatures and audit trail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <section className="glass-card p-8 rounded-xl mb-12">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-primary mr-4" />
              <h2 className="text-2xl font-bold">Industry-Leading Security</h2>
            </div>
            <p className="text-foreground/80 mb-6">
              SignPov prioritizes the security and privacy of your documents and signatures.
              Our platform incorporates multiple layers of protection:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-foreground/70">
                  All documents and signatures are encrypted using AES-256 bit encryption, 
                  ensuring they remain private and secure.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Secure Authentication</h3>
                <p className="text-sm text-foreground/70">
                  Multi-factor authentication options and email verification ensure only 
                  authorized individuals access documents.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Audit Trails</h3>
                <p className="text-sm text-foreground/70">
                  Comprehensive audit trails track every action taken on a document, 
                  providing legal validity and transparency.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Legal Compliance</h3>
                <p className="text-sm text-foreground/70">
                  SignPov signatures comply with ESIGN, UETA, and eIDAS regulations, 
                  making them legally binding in most jurisdictions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
