
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/utils/emailUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TempEmail {
  id: string;
  temp_email: string;
  forwarding_to: string;
  created_at: string;
  expires_at: string;
}

interface TempEmailDetailsProps {
  email: TempEmail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TempEmailDetails({ email, open, onOpenChange }: TempEmailDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopied(id);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Temporary Email Details</DialogTitle>
          <DialogDescription>
            Save or copy this information for future reference.
          </DialogDescription>
        </DialogHeader>
        
        {email && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temporary Email Address:</p>
                  <div className="flex items-center justify-between">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm break-all">
                      {email.temp_email}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0 ml-2"
                      onClick={() => handleCopy(email.temp_email, "dialog")}
                    >
                      {copied === "dialog" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Forwards To:</p>
                  <p className="break-all">{email.forwarding_to}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created:</p>
                  <p>{new Date(email.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expires:</p>
                  <p>{new Date(email.expires_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border-amber-200 border p-3 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This is an optional privacy feature. You can still use your regular email for document signing.
              </p>
            </div>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleCopy(email.temp_email, "dialog-full")}
            >
              {copied === "dialog-full" ? "Copied!" : "Copy Email Address"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
