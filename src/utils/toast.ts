
import { toast as sonnerToast } from "sonner";

// Create a wrapper for sonner's toast that accepts our preferred format
export const toast = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  // You can add more properties as needed
}) => {
  // Use the correct Sonner API
  if (props.variant === "destructive") {
    return sonnerToast.error(props.title || "", {
      description: props.description
    });
  }
  
  return sonnerToast(props.title || "", {
    description: props.description
  });
};

// Add helper methods for direct usage
toast.error = (message: string) => {
  return sonnerToast.error(message);
};

toast.success = (message: string) => {
  return sonnerToast.success(message);
};

// Also re-export the original for cases where needed
export { sonnerToast };
