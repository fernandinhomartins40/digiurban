
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface ChatSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatSettingsSheet({ open, onOpenChange }: ChatSettingsSheetProps) {
  // We'll use this simplified version that doesn't rely on the updated chat context yet
  
  const handleSave = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Configurações do Chat
          </SheetTitle>
          <SheetDescription>
            Personalize sua experiência de chat
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações do navegador</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações de novas mensagens
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Sons de notificação</Label>
                <p className="text-sm text-muted-foreground">
                  Tocar som ao receber mensagens
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </div>

        <SheetFooter className="pt-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
