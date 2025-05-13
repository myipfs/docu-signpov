
import { AlertCircle } from "lucide-react";
import { TempEmailItem } from "./TempEmailItem";

interface TempEmail {
  id: string;
  temp_email: string;
  forwarding_to: string;
  expires_at: string;
  created_at: string;
}

interface TempEmailListProps {
  emails: TempEmail[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onShowDetails: (email: TempEmail) => void;
}

export function TempEmailList({ emails, isLoading, error, onShowDetails }: TempEmailListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-800 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>Error loading temporary emails. Please try refreshing.</p>
      </div>
    );
  }
  
  if (!emails || emails.length === 0) {
    return (
      <p className="text-muted-foreground p-4 text-center border rounded-lg bg-muted/30">
        No temporary emails created yet.
      </p>
    );
  }
  
  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <TempEmailItem 
          key={email.id} 
          email={email} 
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
}
