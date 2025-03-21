
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Copy, Check, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  createTemporaryEmail,
  getUserTemporaryEmails,
  deleteTemporaryEmail,
  copyToClipboard
} from "@/utils/emailUtils";

export function TempEmailManager() {
  const [forwardingEmail, setForwardingEmail] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: tempEmails, isLoading, error } = useQuery({
    queryKey: ["tempEmails"],
    queryFn: getUserTemporaryEmails
  });

  // Log error if present for debugging
  useEffect(() => {
    if (error) {
      console.error("Query error:", error);
    }
  }, [error]);

  const createMutation = useMutation({
    mutationFn: createTemporaryEmail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tempEmails"] });
      toast({
        title: "Email Created",
        description: "Your temporary email has been created successfully."
      });
      setForwardingEmail("");
      
      // Show info dialog for the newly created email
      setSelectedEmail(data);
      setShowEmailInfo(true);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to create temporary email. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemporaryEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tempEmails"] });
      toast({
        title: "Email Deleted",
        description: "The temporary email has been deleted."
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forwardingEmail) {
      toast({
        title: "Error",
        description: "Please enter a forwarding email address.",
        variant: "destructive"
      });
      return;
    }
    
    createMutation.mutate(forwardingEmail);
  };

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopied(id);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard"
    });
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  const handleShowInfo = (email: any) => {
    setSelectedEmail(email);
    setShowEmailInfo(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temporary Email Addresses</CardTitle>
          <CardDescription>
            Create temporary email addresses to protect your privacy. All emails will be forwarded to your real address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
            <Input
              type="email"
              placeholder="Enter your forwarding email"
              value={forwardingEmail}
              onChange={(e) => setForwardingEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
            >
              Create Temp Email
            </Button>
          </form>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 border rounded-lg bg-red-50 text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>Error loading temporary emails. Please try refreshing.</p>
            </div>
          ) : tempEmails?.length === 0 ? (
            <p className="text-muted-foreground p-4 text-center border rounded-lg bg-muted/30">
              No temporary emails created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {tempEmails?.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{email.temp_email}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleCopy(email.temp_email, email.id)}
                      >
                        {copied === email.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Forwards to: {email.forwarding_to}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(email.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowInfo(email)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(email.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Details Dialog */}
      <Dialog open={showEmailInfo} onOpenChange={setShowEmailInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Temporary Email Details</DialogTitle>
            <DialogDescription>
              Save or copy this information for future reference.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmail && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Temporary Email Address:</p>
                    <div className="flex items-center justify-between">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {selectedEmail.temp_email}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleCopy(selectedEmail.temp_email, "dialog")}
                      >
                        {copied === "dialog" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Forwards To:</p>
                    <p>{selectedEmail.forwarding_to}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created:</p>
                    <p>{new Date(selectedEmail.created_at).toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expires:</p>
                    <p>{new Date(selectedEmail.expires_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border-amber-200 border p-3 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Save this email address somewhere secure. 
                  You'll need it when sending documents for signature.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
