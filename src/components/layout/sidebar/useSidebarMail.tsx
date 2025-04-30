
import { useMail } from "@/hooks/use-mail";

export const useSidebarMail = (ready: boolean) => {
  let unreadCount = 0;
  
  if (ready) {
    try {
      // Get unread messages count if available
      const { getIncomingDocuments } = useMail();
      const { data: incomingDocuments } = getIncomingDocuments();
      unreadCount = incomingDocuments?.filter(item => !item.read_at).length || 0;
    } catch (error) {
      console.error("Failed to get mail data:", error);
    }
  }

  return { unreadCount };
};
