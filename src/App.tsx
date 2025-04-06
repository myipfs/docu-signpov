
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SignDocument from "./pages/SignDocument";
import NotFound from "./pages/NotFound";
import DocumentEditor from "./pages/DocumentEditor";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateEditor from "./pages/TemplateEditor";
import EmailSettings from "./pages/EmailSettings";
import QuickSign from "./pages/QuickSign";
import { SessionProvider } from "./context/SessionContext";
import Encryption from "./pages/Encryption";
import FeaturesPage from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MyDocuments from '@/pages/MyDocuments';
import ViewDocument from './pages/ViewDocument';
import Auth from './pages/Auth';
import Plans from './pages/Plans';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/sign/:id" element={<SignDocument />} />
              <Route path="/quick-sign" element={<QuickSign />} />
              <Route path="/editor" element={<DocumentEditor />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/templates/edit/:id" element={<TemplateEditor />} />
              <Route path="/email-settings" element={<EmailSettings />} />
              <Route path="/encryption" element={<Encryption />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/my-documents" element={<MyDocuments />} />
              <Route path="/view-document/:id" element={<ViewDocument />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
