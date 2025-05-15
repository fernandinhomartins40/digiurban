
import { toast as sonnerToast, type ToastOptions as SonnerToastOptions } from "sonner";

export type ToastProps = SonnerToastOptions & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export function toast({ title, description, variant = "default", ...props }: ToastProps) {
  return sonnerToast(title, {
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
}

export function useToast() {
  return { toast };
}
