import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AttachmentUpload } from "@/components/mail/AttachmentUpload";
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Trash2, 
  PaperclipIcon, 
  Loader2, 
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EmailInterno() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inbox");
  const [composing, setComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: ''
  });

  // Exemplo de dados de emails para demonstração
  const mockEmails = [
    { 
      id: '1', 
      from: 'Departamento Financeiro', 
      to: 'RH', 
      subject: 'Orçamento mensal', 
      date: '2023-05-10T14:30:00Z',
      read: true
    },
    { 
      id: '2', 
      from: 'Secretaria de Saúde', 
      to: 'RH', 
      subject: 'Relatório de atendimentos', 
      date: '2023-05-09T10:15:00Z',
      read: false
    },
    { 
      id: '3', 
      from: 'Gabinete do Prefeito', 
      to: 'RH', 
      subject: 'Reunião extraordinária', 
      date: '2023-05-08T16:45:00Z',
      read: true
    }
  ];

  const sentEmails = [
    { 
      id: '4', 
      from: 'RH', 
      to: 'Departamento Jurídico', 
      subject: 'Contratação de novos servidores', 
      date: '2023-05-07T09:00:00Z',
      read: true
    },
    { 
      id: '5', 
      from: 'RH', 
      to: 'Secretaria de Educação', 
      subject: 'Cronograma de capacitações', 
      date: '2023-05-06T11:20:00Z',
      read: true
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = () => {
    // Validação básica
    if (!emailData.to || !emailData.subject || !emailData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular envio
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Email interno enviado",
        description: `Email enviado para ${emailData.to}.`,
      });
      
      // Limpar formulário
      setEmailData({
        to: '',
        subject: '',
        content: ''
      });
      setAttachments([]);
      setComposing(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenEmail = (id: string) => {
    toast({
      title: "Email aberto",
      description: `Visualizando email ${id}.`,
    });
  };

  const renderComposeForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail size={20} />
          Novo Email Interno
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium mb-1">
              Para (Departamento)
            </label>
            <Input 
              id="to" 
              name="to" 
              placeholder="Nome do departamento" 
              value={emailData.to}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Assunto
            </label>
            <Input 
              id="subject" 
              name="subject" 
              placeholder="Assunto do email" 
              value={emailData.subject}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Conteúdo
            </label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="Digite o conteúdo do email aqui..." 
              rows={6}
              value={emailData.content}
              onChange={handleInputChange}
              className="resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Anexos
            </label>
            <div className="border rounded-md p-4">
              {attachments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-1 bg-muted p-2 rounded-md">
                      <FileText size={16} />
                      <span className="text-sm">{attachment}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum anexo adicionado</p>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  // Simular adição de anexo
                  setAttachments(prev => [...prev, `documento_${prev.length + 1}.pdf`]);
                  toast({
                    title: "Anexo adicionado",
                    description: "O arquivo foi anexado com sucesso.",
                  });
                }}
              >
                <PaperclipIcon size={16} className="mr-2" /> 
                Adicionar anexo
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setComposing(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={handleSendEmail}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderEmailList = (emails: typeof mockEmails) => (
    <div className="rounded-md border">
      <div className="divide-y">
        {emails.map(email => (
          <div 
            key={email.id} 
            className={`p-4 cursor-pointer hover:bg-muted/50 flex justify-between ${!email.read ? 'bg-muted/20 font-medium' : ''}`}
            onClick={() => handleOpenEmail(email.id)}
          >
            <div>
              <div className="font-medium">{email.from} → {email.to}</div>
              <div className="text-sm text-muted-foreground">{email.subject}</div>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(email.date)}
              {!email.read && <Badge className="ml-2 bg-primary">Novo</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Interno</h1>
        <p className="text-muted-foreground">
          Envie e receba mensagens internas entre departamentos
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => setComposing(true)} 
          className={composing ? "hidden" : ""}
        >
          <Mail className="mr-2 h-4 w-4" />
          Nova Mensagem
        </Button>
      </div>

      {composing ? (
        renderComposeForm()
      ) : (
        <Tabs defaultValue="inbox" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="inbox" className="flex items-center gap-1">
              <Inbox className="h-4 w-4" />
              <span>Caixa de Entrada</span>
              <Badge variant="outline" className="ml-1 bg-primary text-primary-foreground">
                {mockEmails.filter(e => !e.read).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-1">
              <Send className="h-4 w-4" />
              <span>Enviados</span>
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex items-center gap-1">
              <Archive className="h-4 w-4" />
              <span>Arquivo</span>
            </TabsTrigger>
            <TabsTrigger value="trash" className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              <span>Lixeira</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="mt-4">
            {renderEmailList(mockEmails)}
          </TabsContent>
          <TabsContent value="sent" className="mt-4">
            {renderEmailList(sentEmails)}
          </TabsContent>
          <TabsContent value="archive" className="mt-4">
            <p className="text-center py-8 text-muted-foreground">Nenhum email arquivado</p>
          </TabsContent>
          <TabsContent value="trash" className="mt-4">
            <p className="text-center py-8 text-muted-foreground">Lixeira vazia</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
