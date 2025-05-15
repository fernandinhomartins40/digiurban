
import { toast as sonnerToast, type Toast, ToastT } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  id?: string;
  action?: React.ReactNode;
  [key: string]: any;
};

// Array to store toast references
let toasts: ToastT[] = [];

export function toast({ title, description, variant = "default", ...props }: ToastProps) {
  const id = sonnerToast(title, {
    description,
    classNames: {
      toast: variant === "destructive" 
        ? "bg-destructive text-destructive-foreground" 
        : variant === "success" 
          ? "bg-green-500 text-white" 
          : "",
    },
    ...props,
  });
  
  // Store reference to toast for potential future manipulation
  toasts.push({id, title, description, ...props});
  return id;
}

export function useToast() {
  return { 
    toast,
    toasts: () => toasts, // Getter function to access current toasts
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
        toasts = toasts.filter(t => t.id !== toastId);
      }
    },
  };
}
