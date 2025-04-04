
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-foreground/70">Last updated: April 4, 2025</p>
          </div>
          
          <div className="prose prose-foreground max-w-none">
            <p>
              SignPov Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by SignPov Inc. This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service"). By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
            </p>
            
            <h2>1. Information We Collect</h2>
            
            <h3>1.1. Personal Data</h3>
            <p>
              When you use our Service, we may collect the following personal information from you:
            </p>
            <ul>
              <li>Contact information (such as name, email address, mailing address, phone number)</li>
              <li>Account credentials (such as username, password)</li>
              <li>Billing information (such as credit card details, billing address)</li>
              <li>User content (such as documents uploaded, signatures, form responses)</li>
              <li>Profile information (such as profile photo, job title, company)</li>
            </ul>
            
            <h3>1.2. Usage Data</h3>
            <p>
              We automatically collect certain information when you visit, use, or navigate the Service. This information does not reveal your specific identity but may include:
            </p>
            <ul>
              <li>Device and usage information (such as IP address, browser type, operating system)</li>
              <li>Log data (such as access times, pages viewed, time spent on pages)</li>
              <li>Location information (such as general location based on IP address)</li>
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect for various business purposes, including:
            </p>
            <ul>
              <li>Providing, maintaining, and improving our Service to you</li>
              <li>Processing and completing transactions</li>
              <li>Sending transactional messages, including responses to your comments, questions, and requests</li>
              <li>Sending promotional communications, such as providing you with information about services, features, newsletters, offers, promotions, contests, and events</li>
              <li>Monitoring and analyzing trends, usage, and activities in connection with our Service</li>
              <li>Detecting, investigating, and preventing fraudulent transactions and other illegal activities</li>
              <li>Personalizing the Service and providing advertisements, content, or features that match your profile or interests</li>
              <li>Facilitating contests, sweepstakes, and promotions and processing and delivering entries and rewards</li>
            </ul>
            
            <h2>3. Zero-Knowledge Encryption</h2>
            <p>
              SignPov employs a zero-knowledge encryption architecture for your document signatures and sensitive content. This means:
            </p>
            <ul>
              <li>Your document contents and signatures are encrypted on your device before being sent to our servers</li>
              <li>The encryption keys are generated and stored only on your device</li>
              <li>We cannot access or view the contents of your encrypted documents or signatures</li>
              <li>Even in the event of a legal request, we cannot provide decrypted access to your documents or signatures as we do not possess the encryption keys</li>
            </ul>
            <p>
              This provides an additional layer of security and privacy for your most sensitive information. However, please note that certain account and metadata information is not encrypted in this manner to enable the basic functionality of the service.
            </p>
            
            <h2>4. Sharing Your Information</h2>
            <p>
              We may share the information we collect in various ways, including:
            </p>
            <ul>
              <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
              <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of SignPov Inc. or others</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
              <li>Between and among SignPov Inc. and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2>5. Your Rights and Choices</h2>
            <p>
              You have certain rights regarding your personal information:
            </p>
            <ul>
              <li>Access, correct, or delete your personal information by logging into your account settings</li>
              <li>Opt out of marketing communications by following the opt-out instructions in the promotional emails we send you</li>
              <li>Set your browser to refuse cookies or to indicate when a cookie is being sent</li>
              <li>Request deletion of your personal data, subject to certain exceptions</li>
              <li>Request restriction of the processing of your personal data</li>
              <li>Request the transfer of your personal data to you or a third party</li>
            </ul>
            
            <h2>6. Data Security</h2>
            <p>
              We take the security of your information seriously and use appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing and against accidental loss, destruction, or damage. However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            
            <h2>7. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If we learn that we have collected personal information from a child under the age of 13, we will promptly delete that information.
            </p>
            
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              SignPov Inc.<br />
              Email: privacy@signpov.com<br />
              Address: 472 Amherst St. Unit 727173, Nashua, New Hampshire 03063, United States
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
