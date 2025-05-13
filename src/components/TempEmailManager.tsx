
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getUserTemporaryEmails } from "@/utils/emailUtils";
import { TempEmail } from "@/types/temp-email";
import { CreateTempEmailForm } from "./email/CreateTempEmailForm";
import { TempEmailList } from "./email/TempEmailList";
import { TempEmailDetails } from "./email/TempEmailDetails";

export function TempEmailManager() {
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<TempEmail | null>(null);

  const { data: tempEmails, isLoading, error } = useQuery({
    queryKey: ["tempEmails"],
    queryFn: getUserTemporaryEmails
  });

  // Log error if present for debugging
  useEffect(() => {
    if (error) {
      console.error("Query error:", error);
      toast({
        title: "Error",
        description: `Failed to load temporary emails: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  }, [error]);

  const handleShowInfo = (email: TempEmail) => {
    setSelectedEmail(email);
    setShowEmailInfo(true);
  };

  const handleEmailCreated = (email: TempEmail) => {
    setSelectedEmail(email);
    setShowEmailInfo(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Optional Temporary Email Addresses</CardTitle>
          <CardDescription>
            Create temporary email addresses for enhanced privacy. All emails sent to these addresses will be forwarded to your real email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-amber-50 border-amber-200 flex items-start gap-3 mb-6">
            <Shield className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-700 mb-1">Optional Privacy Feature</p>
              <p className="text-sm text-amber-800">
                Temporary emails are <strong>optional</strong>. You can use your regular email address by default, 
                or create temporary forwarding addresses when you need extra privacy.
              </p>
            </div>
          </div>

          <CreateTempEmailForm onEmailCreated={handleEmailCreated} />

          <TempEmailList 
            emails={tempEmails} 
            isLoading={isLoading} 
            error={error as Error | null}
            onShowDetails={handleShowInfo}
          />
        </CardContent>
        <CardFooter className="bg-muted/30 flex justify-center p-4">
          <p className="text-center text-sm text-muted-foreground max-w-md">
            Temporary emails provide an extra layer of privacy for sensitive documents. Use them when you want to keep your personal email address private.
          </p>
        </CardFooter>
      </Card>

      <TempEmailDetails 
        email={selectedEmail}
        open={showEmailInfo}
        onOpenChange={setShowEmailInfo}
      />
    </div>
  );
}
