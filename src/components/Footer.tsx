
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
          <div>
            <h3 className="text-lg font-bold mb-4">DocuSign</h3>
            <p className="text-sm text-foreground/70 max-w-xs">
              A simple, secure platform for requesting and managing digital signatures on any document.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-medium mb-3">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6">
          <p className="text-sm text-foreground/60 text-center">
            &copy; {new Date().getFullYear()} DocuSign. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
