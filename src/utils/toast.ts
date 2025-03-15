
import { toast as sonnerToast } from "sonner";

// Create a wrapper for sonner's toast that accepts our preferred format
export const toast = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  // You can add more properties as needed
}) => {
  return sonnerToast(props.title || "", {
    description: props.description,
    // Map our variant to Sonner's type (the correct property in sonner)
    type: props.variant === "destructive" ? "error" : "default",
  });
};

// Add helper methods for direct usage
toast.error = (message: string) => {
  return sonnerToast(message, {
    type: "error",
  });
};

toast.success = (message: string) => {
  return sonnerToast(message, {
    type: "success",
  });
};

// Also re-export the original for cases where needed
export { sonnerToast };
