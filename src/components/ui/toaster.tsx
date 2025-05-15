
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  // Instead of accessing toasts directly, we'll use the Sonner toaster
  return (
    <>
      <SonnerToaster 
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "group toast border-border shadow-lg",
            title: "text-sm font-semibold",
            description: "text-sm opacity-90",
            actionButton: "bg-primary text-primary-foreground",
            cancelButton: "bg-muted text-muted-foreground",
          }
        }}
      />
    </>
  )
}
