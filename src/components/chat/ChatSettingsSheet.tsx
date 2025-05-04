
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
import { Slider } from "@/components/ui/slider";
import { Settings, Bell, Volume2, MessageSquare, Trash2, Clock } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ChatSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatSettingsSheet({ open, onOpenChange }: ChatSettingsSheetProps) {
  const { chatSettings, updateChatSettings } = useChat();
  const [activeTab, setActiveTab] = useState<string>("geral");

  // Local state for settings that will be applied on save
  const [localSettings, setLocalSettings] = useState(chatSettings);

  const handleSave = () => {
    updateChatSettings(localSettings);
    onOpenChange(false);
  };

  const handleToggle = (key: keyof typeof localSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
          <Tabs defaultValue="geral" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tema da interface</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha o tema para o aplicativo
                    </p>
                  </div>
                  <Select
                    value={localSettings.theme}
                    onValueChange={(value) => 
                      setLocalSettings(prev => ({...prev, theme: value}))
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="claro">Claro</SelectItem>
                      <SelectItem value="escuro">Escuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Ordenação de mensagens</Label>
                    <p className="text-sm text-muted-foreground">
                      Como as mensagens devem ser exibidas
                    </p>
                  </div>
                  <Select
                    value={localSettings.messageOrder}
                    onValueChange={(value: "newest" | "oldest") => 
                      setLocalSettings(prev => ({...prev, messageOrder: value}))
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Ordenação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais recentes</SelectItem>
                      <SelectItem value="oldest">Mais antigas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label className="text-base">Exibir visualização de digitação</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar quando alguém está digitando
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.showTypingIndicator}
                    onCheckedChange={() => handleToggle('showTypingIndicator')}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label className="text-base">Autocompletar</Label>
                    <p className="text-sm text-muted-foreground">
                      Sugerir textos comuns enquanto você digita
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enableAutocomplete}
                    onCheckedChange={() => handleToggle('enableAutocomplete')}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label className="text-base">Correção ortográfica</Label>
                    <p className="text-sm text-muted-foreground">
                      Destacar erros de ortografia
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.spellCheck}
                    onCheckedChange={() => handleToggle('spellCheck')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notificacoes" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <div>
                      <Label className="text-base">Notificações no navegador</Label>
                      <p className="text-sm text-muted-foreground">
                        Exibir notificações mesmo quando o app está fechado
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.browserNotifications}
                    onCheckedChange={() => handleToggle('browserNotifications')}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <div>
                      <Label className="text-base">Sons de notificação</Label>
                      <p className="text-sm text-muted-foreground">
                        Tocar som ao receber novas mensagens
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.notificationSounds}
                    onCheckedChange={() => handleToggle('notificationSounds')}
                  />
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Volume de notificações</Label>
                      <p className="text-sm text-muted-foreground">
                        Ajuste o volume das notificações sonoras
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {localSettings.notificationVolume}%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[localSettings.notificationVolume]}
                    max={100}
                    step={10}
                    className="py-4"
                    onValueChange={([value]) => 
                      setLocalSettings(prev => ({...prev, notificationVolume: value}))
                    }
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <div>
                      <Label className="text-base">Notificação de leitura</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar confirmação quando você ler mensagens
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.sendReadReceipts}
                    onCheckedChange={() => handleToggle('sendReadReceipts')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacidade" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <Label className="text-base">Mostrar status online</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros vejam quando você está online
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.showOnlineStatus}
                    onCheckedChange={() => handleToggle('showOnlineStatus')}
                  />
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <div className="space-y-2">
                    <Label className="text-base">Histórico de conversas</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha por quanto tempo manter seu histórico de conversa
                    </p>
                  </div>
                  
                  <Select
                    value={localSettings.messageHistory}
                    onValueChange={(value) => 
                      setLocalSettings(prev => ({...prev, messageHistory: value}))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Histórico de mensagens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forever">Manter para sempre</SelectItem>
                      <SelectItem value="1year">Manter por 1 ano</SelectItem>
                      <SelectItem value="6months">Manter por 6 meses</SelectItem>
                      <SelectItem value="3months">Manter por 3 meses</SelectItem>
                      <SelectItem value="1month">Manter por 1 mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir histórico de conversas
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="pt-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
