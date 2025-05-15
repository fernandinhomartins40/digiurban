
import { useState, useEffect } from 'react';
import { toast as sonnerToast, ToastT } from 'sonner';

export type ToastProps = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

export const toast = ({ title, description, variant, action, ...props }: ToastProps) => {
  return sonnerToast(title as string, {
    description,
    action,
    className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
    ...props,
  });
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastT[]>([]);

  useEffect(() => {
    return () => {
      toasts.forEach((toast) => {
        if (toast.id) {
          sonnerToast.dismiss(toast.id);
        }
      });
    };
  }, [toasts]);

  return {
    toast: (props: ToastProps) => {
      const newToast = toast(props) as ToastT;
      setToasts((prev) => [...prev, newToast]);
      return newToast;
    },
    dismiss: (toastId: string) => {
      sonnerToast.dismiss(toastId);
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    },
    toasts
  };
};
