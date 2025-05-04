
import React from "react";
import { OuvidoriaLayout } from "../components/OuvidoriaLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Users, 
  Clock, 
  Calendar,
  Smartphone,
  BookOpen,
  Settings 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AtendimentoIndex() {
  return (
    <OuvidoriaLayout title="Atendimento" description="Gestão de canais de atendimento ao cidadão">
      <div className="space-y-6">
        {/* Channel Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Formulário Online
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">226</div>
              <p className="text-xs text-muted-foreground mt-1">
                58% das manifestações
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Atendimento Telefônico
              </CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground mt-1">
                23% das manifestações
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Atendimento Presencial
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62</div>
              <p className="text-xs text-muted-foreground mt-1">
                16% das manifestações
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                App Mobile
              </CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                3% das manifestações
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Channel Management */}
        <Tabs defaultValue="schedule">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="schedule" className="flex items-center justify-center">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Telefônico</span>
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Online</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center justify-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Service Hours Tab */}
          <TabsContent value="schedule" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Horários de Atendimento</CardTitle>
                <CardDescription>
                  Configuração dos horários de atendimento por canal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Canal</TableHead>
                      <TableHead>Dias</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Atendimento Presencial</TableCell>
                      <TableCell>Segunda a Sexta</TableCell>
                      <TableCell>08:00 às 17:00</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Atendimento Telefônico</TableCell>
                      <TableCell>Segunda a Sexta</TableCell>
                      <TableCell>08:00 às 18:00</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Formulário Online</TableCell>
                      <TableCell>Todos os dias</TableCell>
                      <TableCell>24 horas</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Aplicativo Mobile</TableCell>
                      <TableCell>Todos os dias</TableCell>
                      <TableCell>24 horas</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Datas Especiais</CardTitle>
                <CardDescription>
                  Configuração de horários especiais para feriados e eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium">Próximos feriados</div>
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Adicionar Data
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Canais Afetados</TableHead>
                      <TableHead>Observação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">01/05/2023</TableCell>
                      <TableCell>Dia do Trabalho</TableCell>
                      <TableCell>Presencial, Telefônico</TableCell>
                      <TableCell>Sem atendimento</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">07/09/2023</TableCell>
                      <TableCell>Independência</TableCell>
                      <TableCell>Presencial, Telefônico</TableCell>
                      <TableCell>Sem atendimento</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Phone Service Tab */}
          <TabsContent value="phone" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Atendimento Telefônico</CardTitle>
                <CardDescription>
                  Gerenciamento do canal de atendimento telefônico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormItem>
                      <FormLabel>Número principal</FormLabel>
                      <FormControl>
                        <Input type="tel" value="(99) 3333-4444" />
                      </FormControl>
                      <FormDescription>
                        Número principal de contato da ouvidoria
                      </FormDescription>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Número secundário</FormLabel>
                      <FormControl>
                        <Input type="tel" value="0800 123 4567" />
                      </FormControl>
                      <FormDescription>
                        Número gratuito para ligações
                      </FormDescription>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input value="Maria Oliveira" />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select defaultValue="active">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                          <SelectItem value="maintenance">Em manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button type="submit">Salvar Alterações</Button>
                  </div>
                </Form>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Estatísticas do Canal</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Ligações/dia</p>
                      <p className="text-lg font-medium">12.4</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Tempo médio</p>
                      <p className="text-lg font-medium">8m12s</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Taxa resolução</p>
                      <p className="text-lg font-medium">76%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Online Service Tab */}
          <TabsContent value="online" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Canais Online</CardTitle>
                <CardDescription>
                  Gerenciamento dos canais digitais de atendimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <Mail className="mr-2 h-4 w-4" />
                        E-mail
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">ouvidoria@municipio.gov.br</p>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Tempo médio de resposta: 1.2 dias
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Formulário Web
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">municipio.gov.br/ouvidoria</p>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        226 manifestações no último mês
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Aplicativo Mobile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">Cidadão Municipal (Android/iOS)</p>
                      <Badge className="bg-amber-100 text-amber-800">Em testes</Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        12 manifestações no último mês
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat Online
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">Atendimento em tempo real</p>
                      <Badge className="bg-gray-100 text-gray-800">Desativado</Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Previsão de lançamento: Junho/2023
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar Canais
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Perguntas Frequentes</CardTitle>
                    <CardDescription>
                      Gerenciamento da base de conhecimento para autoatendimento
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Pergunta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Buscar perguntas frequentes..."
                    className="mb-4"
                  />
                  
                  <div className="space-y-2">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">
                          Como faço para registrar uma reclamação?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 text-sm">
                        <p>Para registrar uma reclamação, você pode utilizar o formulário online disponível no site da Prefeitura, ligar para o número 0800 123 4567, enviar e-mail para ouvidoria@municipio.gov.br ou comparecer pessoalmente na sede da Ouvidoria.</p>
                      </CardContent>
                      <div className="px-6 py-3 flex justify-between items-center border-t text-sm mt-3">
                        <span className="text-muted-foreground">Visualizações: 578</span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">Excluir</Button>
                        </div>
                      </div>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">
                          Qual o prazo para resposta de uma manifestação?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 text-sm">
                        <p>Por lei, o prazo máximo para resposta é de 30 dias corridos, podendo ser prorrogado por mais 30 dias mediante justificativa. No entanto, nosso tempo médio de resposta atual é de 3.2 dias.</p>
                      </CardContent>
                      <div className="px-6 py-3 flex justify-between items-center border-t text-sm mt-3">
                        <span className="text-muted-foreground">Visualizações: 423</span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">Excluir</Button>
                        </div>
                      </div>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">
                          Posso fazer uma denúncia anônima?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 text-sm">
                        <p>Sim, é possível fazer denúncias anônimas através de todos os nossos canais de atendimento. No entanto, denúncias identificadas podem facilitar o processo de apuração caso sejam necessárias informações adicionais.</p>
                      </CardContent>
                      <div className="px-6 py-3 flex justify-between items-center border-t text-sm mt-3">
                        <span className="text-muted-foreground">Visualizações: 389</span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">Excluir</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OuvidoriaLayout>
  );
}

function Plus({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
