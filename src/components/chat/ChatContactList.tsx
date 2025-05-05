
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, Star, User } from "lucide-react";

interface ChatContactListProps {
  contacts: Contact[];
  onSelect: (id: string, name: string) => void;
}

export function ChatContactList({ contacts, onSelect }: ChatContactListProps) {
  return (
    <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center p-3 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={() => onSelect(contact.id, contact.name)}
        >
          <Avatar className="h-9 w-9 mr-3 flex-shrink-0">
            <AvatarFallback>
              {contact.type === 'department' ? (
                <Building className="h-4 w-4" />
              ) : (
                contact.name.charAt(0)
              )}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className="font-medium text-sm truncate">{contact.name}</span>
              {contact.favorite && (
                <Star className="h-3 w-3 text-yellow-500 ml-1 flex-shrink-0" />
              )}
            </div>
            
            {contact.departmentName && (
              <p className="text-xs text-muted-foreground truncate">
                {contact.departmentName}
              </p>
            )}
          </div>
          
          <div className={cn(
            "h-2.5 w-2.5 rounded-full flex-shrink-0",
            contact.status === 'online' ? "bg-green-500" : "bg-gray-300"
          )} />
        </div>
      ))}
    </div>
  );
}
