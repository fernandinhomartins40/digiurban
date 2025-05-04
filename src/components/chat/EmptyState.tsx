
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center h-full p-6 text-center", className)}>
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        {icon || <MessageCircle className="h-6 w-6 text-primary" />}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
