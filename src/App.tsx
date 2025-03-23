
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SignDocument from "./pages/SignDocument";
import NotFound from "./pages/NotFound";
import DocumentEditor from "./pages/DocumentEditor";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateEditor from "./pages/TemplateEditor";
import EmailSettings from "./pages/EmailSettings";

// Create a client for React Query
const queryClient = new QueryClient();

// Main App component that sets up providers and routing
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner />
        
        {/* Router setup */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sign/:id" element={<SignDocument />} />
            <Route path="/editor" element={<DocumentEditor />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/edit/:id" element={<TemplateEditor />} />
            <Route path="/email-settings" element={<EmailSettings />} />
            {/* Catch all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
