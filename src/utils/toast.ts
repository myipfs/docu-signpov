
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
    // Map our variant to a valid sonner property
    ...(props.variant === "destructive" ? { className: "destructive" } : {})
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
