
import React from "react";
import { SegurancaLayout } from "./components/SegurancaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SegurancaPublicaIndex() {
  const navigate = useNavigate();

  return (
    <SegurancaLayout>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Ocorrências</span>
                <AlertTriangle size={20} className="text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Registro e acompanhamento de ocorrências de segurança no município.
                </p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Ocorrências hoje</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pendentes</span>
                    <span className="font-medium">4</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/admin/seguranca/ocorrencias")}
                >
                  Gerenciar Ocorrências
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Guarda Municipal</span>
                <Shield size={20} className="text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gestão do efetivo e operações da Guarda Municipal.
                </p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Efetivo ativo</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Em patrulhamento</span>
                    <span className="font-medium">28</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/admin/seguranca/guarda")}
                >
                  Gerenciar Guarda
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Videomonitoramento</span>
                <Video size={20} className="text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gestão do sistema de câmeras de segurança do município.
                </p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Câmeras ativas</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alertas hoje</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/admin/seguranca/cameras")}
                >
                  Acessar Câmeras
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h4 className="font-semibold">Últimas Ocorrências</h4>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    { id: 1, tipo: "Perturbação", local: "Praça Central", data: "Hoje, 14:30" },
                    { id: 2, tipo: "Acidente de Trânsito", local: "Av. Principal", data: "Hoje, 10:15" },
                    { id: 3, tipo: "Vandalismo", local: "Escola Municipal", data: "Ontem, 23:40" }
                  ].map((ocorrencia) => (
                    <div key={ocorrencia.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{ocorrencia.tipo}</span>
                        <span className="text-muted-foreground ml-2">- {ocorrencia.local}</span>
                      </div>
                      <span className="text-muted-foreground">{ocorrencia.data}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Estatísticas da Semana</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    { label: "Ocorrências", valor: 87 },
                    { label: "Resolvidas", valor: 74 },
                    { label: "Patrulhamentos", valor: 125 },
                    { label: "Alertas de Câmeras", valor: 18 }
                  ].map((stat, index) => (
                    <div key={index} className="bg-muted rounded-md p-2 text-center">
                      <div className="text-2xl font-bold">{stat.valor}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SegurancaLayout>
  );
}
