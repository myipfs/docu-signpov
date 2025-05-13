
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTemporaryEmail, copyToClipboard } from "@/utils/emailUtils";
import { toast } from "@/components/ui/use-toast";

interface TempEmail {
  id: string;
  temp_email: string;
  forwarding_to: string;
  expires_at: string;
}

interface TempEmailItemProps {
  email: TempEmail;
  onShowDetails: (email: TempEmail) => void;
}

export function TempEmailItem({ email, onShowDetails }: TempEmailItemProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTemporaryEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tempEmails"] });
      toast({
        title: "Email Deleted",
        description: "The temporary email has been deleted."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete temporary email: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard"
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium truncate max-w-xs">{email.temp_email}</p>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handleCopy(email.temp_email)}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground truncate">
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
          onClick={() => onShowDetails(email)}
        >
          Details
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteMutation.mutate(email.id)}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending && deleteMutation.variables === email.id ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
