
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemporaryEmail } from "@/utils/emailUtils";
import { isValidEmail } from "@/utils/validationUtils";

interface CreateTempEmailFormProps {
  onEmailCreated: (email: any) => void;
}

export function CreateTempEmailForm({ onEmailCreated }: CreateTempEmailFormProps) {
  const [forwardingEmail, setForwardingEmail] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTemporaryEmail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tempEmails"] });
      toast({
        title: "Email Created",
        description: "Your temporary email has been created successfully."
      });
      setForwardingEmail("");
      onEmailCreated(data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: `Failed to create temporary email: ${(error as Error).message}`,
        variant: "destructive"
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
    
    if (!isValidEmail(forwardingEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    createMutation.mutate(forwardingEmail);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <Input
        type="email"
        placeholder="Enter your forwarding email"
        value={forwardingEmail}
        onChange={(e) => setForwardingEmail(e.target.value)}
        className="flex-1"
        required
      />
      <Button 
        type="submit" 
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? "Creating..." : "Create Temp Email"}
      </Button>
    </form>
  );
}
