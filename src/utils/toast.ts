
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
    // Map variant to Sonner's type
    type: props.variant === "destructive" ? "error" : "default",
  });
};

// Also re-export the original for cases where needed
export { sonnerToast };
