
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, Key, FileText } from 'lucide-react';

const Encryption = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Your Data, <span className="text-gradient">Encrypted</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              How we protect your information with end-to-end encryption
            </p>
          </div>

          <div className="space-y-12">
            {/* Encryption Overview */}
            <section className="glass-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-2xl font-bold">End-to-End Encryption</h2>
              </div>
              <p className="mb-4">
                At SignPov, we use end-to-end encryption to ensure that your sensitive information, including signatures,
                remains private and secure. Even we cannot access your encrypted data without your encryption keys.
              </p>
              <p>
                Our platform uses the Web Crypto API with AES-GCM 256-bit encryption, which is a
                military-grade encryption standard. This means your data is scrambled in a way that makes it 
                impossible to read without the correct decryption key.
              </p>
            </section>

            {/* How It Works */}
            <section className="glass-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <Lock className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-2xl font-bold">How Our Encryption Works</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Key Generation</h3>
                  <p className="text-foreground/80">
                    When you first use SignPov, a unique encryption key is generated for your account using the Web Crypto API.
                    This key is derived using PBKDF2 (Password-Based Key Derivation Function 2) with 100,000 iterations and a 
                    random salt, making it extremely resistant to brute force attacks.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Local Storage</h3>
                  <p className="text-foreground/80">
                    Your encryption key is stored securely in your browser's local storage. It never leaves your device 
                    and is never transmitted to our servers. This is a critical part of our "zero-knowledge" approach.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Data Encryption</h3>
                  <p className="text-foreground/80">
                    Before any sensitive data (like signatures) is sent to our servers, it's encrypted on your device.
                    We use AES-GCM (Advanced Encryption Standard with Galois/Counter Mode), a highly secure encryption
                    algorithm that provides both confidentiality and data integrity.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Server Storage</h3>
                  <p className="text-foreground/80">
                    On our servers, we only store the encrypted version of your data. Without your encryption key,
                    this data is just a series of random characters that cannot be deciphered, even by us.
                  </p>
                </div>
              </div>
            </section>

            {/* Why We Can't Access Your Data */}
            <section className="glass-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <Key className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-2xl font-bold">Why We Can't Access Your Data</h2>
              </div>
              
              <p className="mb-4">
                SignPov employs a "zero-knowledge" architecture, which means we have zero knowledge of your 
                encryption keys or the contents of your encrypted data. Here's why this matters:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>Your encryption keys are generated and stored only on your device</li>
                <li>Data is encrypted before it leaves your device using these local keys</li>
                <li>We only store the encrypted data, never the encryption keys</li>
                <li>Without the keys, the encrypted data is impossible to decrypt</li>
                <li>Even if legally compelled, we cannot provide your unencrypted data to anyone</li>
                <li>If you lose your encryption keys, we cannot recover your data</li>
              </ul>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-foreground/80">
                <h4 className="font-medium mb-2 flex items-center">
                  <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  Important Note
                </h4>
                <p>
                  Because we use client-side encryption with keys stored locally, it's important to remember that 
                  if you clear your browser data or switch to a new device, you may lose access to your encrypted data.
                  We recommend backing up your important documents separately.
                </p>
              </div>
            </section>

            {/* Technical Details */}
            <section className="glass-card p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-2xl font-bold">Technical Details</h2>
              </div>
              
              <div className="space-y-4 text-sm text-foreground/80">
                <p>For those interested in the technical implementation, our encryption uses:</p>
                
                <ul className="list-disc pl-6 space-y-1">
                  <li>Web Crypto API - A standardized browser API for cryptographic operations</li>
                  <li>AES-GCM 256-bit encryption - A highly secure encryption algorithm</li>
                  <li>PBKDF2 key derivation - With 100,000 iterations for additional security</li>
                  <li>Random IVs (Initialization Vectors) - Ensuring the same data encrypts differently each time</li>
                  <li>Secure local storage - Keys remain local to the user's device</li>
                </ul>
                
                <p className="mt-4">
                  This implementation follows cryptographic best practices and provides a very high level of security
                  while maintaining a good user experience.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Encryption;
