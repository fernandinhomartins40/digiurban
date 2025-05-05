
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
    <ScrollArea className="h-[calc(100vh-150px)]">
      <div className="space-y-1">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center p-3 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
            onClick={() => onSelect(contact.id, contact.name)}
          >
            <Avatar className="h-8 w-8 mr-3">
              {contact.type === 'department' ? (
                <Building className="h-4 w-4" />
              ) : (
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-sm">{contact.name}</span>
                {contact.favorite && (
                  <Star className="h-3 w-3 text-yellow-500 ml-1" />
                )}
              </div>
              
              {contact.departmentName && (
                <p className="text-xs text-muted-foreground">
                  {contact.departmentName}
                </p>
              )}
            </div>
            
            <div className={cn(
              "h-2 w-2 rounded-full",
              contact.status === 'online' ? "bg-green-500" : "bg-gray-300"
            )} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
