
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createTemporaryEmail, getUserTemporaryEmails, deleteTemporaryEmail } from "@/utils/emailUtils";

export function TempEmailManager() {
  const [forwardingEmail, setForwardingEmail] = useState("");
  const queryClient = useQueryClient();

  const { data: tempEmails, isLoading } = useQuery({
    queryKey: ["tempEmails"],
    queryFn: getUserTemporaryEmails
  });

  const createMutation = useMutation({
    mutationFn: createTemporaryEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tempEmails"] });
      toast({
        title: "Email Created",
        description: "Your temporary email has been created successfully."
      });
      setForwardingEmail("");
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
            <Button type="submit" disabled={createMutation.isPending}>
              Create Temp Email
            </Button>
          </form>

          <div className="space-y-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : tempEmails?.length === 0 ? (
              <p className="text-muted-foreground">No temporary emails created yet.</p>
            ) : (
              tempEmails?.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{email.temp_email}</p>
                    <p className="text-sm text-muted-foreground">
                      Forwards to: {email.forwarding_to}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(email.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(email.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
