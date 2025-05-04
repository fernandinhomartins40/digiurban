
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Trash2 } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { Badge } from "@/components/ui/badge";

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const { 
    notifications = [], 
    markAllNotificationsAsRead, 
    deleteNotification, 
    clearAllNotifications, 
    setActiveConversation 
  } = useChat();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="pt-10">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notificações
            {notifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Atualizações e mensagens do sistema
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1">
          <ScrollArea className="h-[calc(100vh-240px)]">
            {notifications.length > 0 ? (
              <div className="space-y-4 pr-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      !notification.read ? "bg-muted/40 border-muted-foreground/20" : "bg-background"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => markAllNotificationsAsRead([notification.id])}
                            title="Marcar como lida"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                          title="Excluir notificação"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {notification.conversationId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            onOpenChange(false);
                            setTimeout(() => {
                              if (notification.conversationId) {
                                setActiveConversation(notification.conversationId);
                              }
                            }, 300);
                          }}
                        >
                          Ver conversa
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h4 className="text-lg font-medium">Sem notificações</h4>
                <p className="text-muted-foreground text-sm max-w-xs mt-1">
                  Você não possui notificações no momento. As notificações aparecerão aqui quando você receber novas mensagens.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {notifications.length > 0 && (
          <SheetFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              className="sm:flex-1"
              onClick={() => markAllNotificationsAsRead(notifications.map(n => n.id))}
            >
              Marcar todas como lidas
            </Button>
            <Button 
              variant="outline"
              className="sm:flex-1"
              onClick={clearAllNotifications}
            >
              Limpar todas
            </Button>
            <SheetClose asChild>
              <Button variant="default" className="sm:flex-1">Fechar</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
