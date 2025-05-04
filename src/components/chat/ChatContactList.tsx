
import React from "react";
import { useChat, ChatContact } from "@/contexts/ChatContext";
import { User, Building2, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatContactListProps {
  type: "department" | "citizen" | "admin" | "all";
  searchQuery: string;
  onSelectContact: (contactId: string) => void;
  activeContactId: string | null;
}

export function ChatContactList({ 
  type, 
  searchQuery, 
  onSelectContact,
  activeContactId 
}: ChatContactListProps) {
  const { contacts, conversations } = useChat();

  // Filter contacts by type and search query
  const filteredContacts = contacts.filter(contact => {
    // Filter by type
    if (type !== "all" && contact.type !== type) return false;
    
    // Filter by search query
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort contacts: favorites first, then by online status, then by name
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    // Favorites first
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    
    // Online contacts first
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    
    // Sort by name
    return a.name.localeCompare(b.name);
  });

  // Get unread message count for contacts
  const getUnreadCountByContact = (contactId: string): number => {
    return conversations.filter(conv => 
      conv.contactId === contactId && conv.unreadCount > 0
    ).reduce((sum, conv) => sum + conv.unreadCount, 0);
  };

  if (sortedContacts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Nenhum contato encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sortedContacts.map((contact) => {
        const unreadCount = getUnreadCountByContact(contact.id);
        const isActive = activeContactId === contact.id;
        
        return (
          <div 
            key={contact.id}
            className={cn(
              "flex items-center p-2 rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted/80"
            )}
            onClick={() => onSelectContact(contact.id)}
          >
            <div className="relative mr-3">
              {/* Contact Avatar/Icon */}
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                {contact.type === "department" ? (
                  <Building2 size={18} />
                ) : contact.type === "admin" ? (
                  <Shield size={18} />
                ) : (
                  <User size={18} />
                )}
              </div>
              
              {/* Online Status Indicator */}
              <span className={cn(
                "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
                contact.status === "online" ? "bg-green-500" : 
                contact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
              )}></span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate text-sm">{contact.name}</span>
                {contact.favorite && <Star className="h-3 w-3 text-yellow-500 ml-1" />}
              </div>
              
              {contact.departmentName && (
                <p className="text-xs text-muted-foreground truncate">
                  {contact.departmentName}
                </p>
              )}
              
              {contact.type === "department" && (
                <p className="text-xs text-muted-foreground truncate">
                  Departamento Municipal
                </p>
              )}
            </div>
            
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
