
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OficioDigital() {
  const { toast } = useToast();
  
  const handleDownload = (format: 'pdf' | 'doc' | 'txt') => {
    toast({
      title: `Baixando documento no formato ${format.toUpperCase()}`,
      description: "Seu download começará em instantes.",
    });
  };
  
  const handleSend = () => {
    toast({
      title: "Documento enviado",
      description: "O ofício foi enviado com sucesso.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ofício Digital</h1>
        <p className="text-muted-foreground">
          Visualize, baixe e envie seus ofícios digitais em diferentes formatos
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Ofícios Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border p-4 rounded-md hover:bg-muted/50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ofício - Solicitação de Material</h3>
                    <p className="text-sm text-muted-foreground">Criado em: 12/05/2023</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('doc')}>
                      <Download className="h-4 w-4 mr-1" /> DOC
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md hover:bg-muted/50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ofício - Comunicado Interno</h3>
                    <p className="text-sm text-muted-foreground">Criado em: 10/05/2023</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('doc')}>
                      <Download className="h-4 w-4 mr-1" /> DOC
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md hover:bg-muted/50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ofício - Convite para Reunião</h3>
                    <p className="text-sm text-muted-foreground">Criado em: 08/05/2023</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('txt')}>
                      <Download className="h-4 w-4 mr-1" /> TXT
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Visualização do Documento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 min-h-[400px]">
              <div className="text-center font-bold mb-6">OFÍCIO Nº 123/2023</div>
              
              <div className="mb-6">
                <p>Ao Sr.</p>
                <p>Diretor de Administração</p>
                <p>Assunto: Solicitação de Material</p>
              </div>
              
              <div className="mb-6">
                <p className="mb-4">Prezado Senhor,</p>
                
                <p className="mb-4 text-justify">
                  Venho por meio deste solicitar a aquisição dos materiais listados em anexo, 
                  necessários para o funcionamento adequado do Departamento de Recursos Humanos.
                </p>
                
                <p className="mb-4 text-justify">
                  Os materiais são de extrema importância para a continuidade das atividades 
                  administrativas deste departamento.
                </p>
                
                <p>Atenciosamente,</p>
              </div>
              
              <div className="text-center mt-10">
                <p>Diretor(a) de Recursos Humanos</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleDownload('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Baixar como PDF
              </Button>
              <Button onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Ofício
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
