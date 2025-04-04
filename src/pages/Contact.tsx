
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to an API endpoint
    console.log({ name, email, subject, message });
    // Show success message
    setSubmitted(true);
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Get in <span className="text-gradient">Touch</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              We're here to help with any questions you may have
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Options */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-foreground/70 mb-4">
                  Our friendly team is here to help.
                </p>
                <a href="mailto:support@signpov.com" className="text-primary font-medium hover:underline">
                  support@signpov.com
                </a>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <p className="text-foreground/70 mb-4">
                  Mon-Fri from 9AM to 5PM (EST).
                </p>
                <a href="tel:+18005551234" className="text-primary font-medium hover:underline">
                  +1 (800) 555-1234
                </a>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                <p className="text-foreground/70 mb-4">
                  Available during business hours.
                </p>
                <Button variant="outline" size="sm" className="text-primary">
                  Start Chat
                </Button>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8 rounded-xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-foreground/70 mb-6">
                      Thanks for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Your Name
                          </label>
                          <Input 
                            id="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe" 
                            required 
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <Select value={subject} onValueChange={setSubject} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <Textarea 
                          id="message" 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="How can we help you?" 
                          rows={6} 
                          required 
                        />
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto">
                        Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Find quick answers to common questions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">How long does it take to get a response?</h3>
              <p className="text-foreground/70">
                We aim to respond to all inquiries within 24 hours during business days.
                For urgent matters, please use our live chat option.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">Do you offer phone support?</h3>
              <p className="text-foreground/70">
                Yes, phone support is available Monday through Friday, 9AM to 5PM Eastern Time.
                Our support team can be reached at +1 (800) 555-1234.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">I'm having trouble with my account</h3>
              <p className="text-foreground/70">
                For account-related issues, please provide your account email address and
                a detailed description of the problem when contacting us.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">Can I request a feature?</h3>
              <p className="text-foreground/70">
                Absolutely! We love hearing from our users. Please submit feature requests
                through this form and select "Feedback" as the subject.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
