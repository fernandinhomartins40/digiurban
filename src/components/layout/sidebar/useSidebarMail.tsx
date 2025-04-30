
import { useEffect, useState } from "react";
import { useMail } from "@/hooks/use-mail";

export const useSidebarMail = (ready: boolean) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!ready) {
      return;
    }
    
    try {
      // Get mail hook inside the component
      const mailHook = useMail();
      const { getIncomingDocuments } = mailHook;
      
      // Get documents
      const { data: incomingDocuments } = getIncomingDocuments();
      
      if (incomingDocuments) {
        const count = incomingDocuments.filter(item => !item.read_at).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to get mail data:", err);
      setError(err instanceof Error ? err : new Error("Unknown error loading mail data"));
    }
  }, [ready]);

  return { 
    unreadCount,
    error
  };
};
