
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, User, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const AppointmentScheduler = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <Helmet>
        <title>Agendamentos | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agendamento de Atendimentos</h1>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" /> Novo Agendamento
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Calendário de Agendamentos</CardTitle>
                  <CardDescription>Selecione uma data para ver os compromissos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border p-3 pointer-events-auto"
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Compromissos do Dia</CardTitle>
                  <CardDescription>
                    {date ? date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Selecione uma data'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: '09:00', name: 'João Silva', reason: 'Solicitação de melhoria na infraestrutura do bairro Vila Nova', status: 'confirmado' },
                      { time: '10:30', name: 'Maria Oliveira', reason: 'Discussão sobre projeto social na comunidade', status: 'pendente' },
                      { time: '14:00', name: 'Secretários Municipais', reason: 'Reunião de alinhamento semanal', status: 'confirmado' },
                      { time: '16:30', name: 'Pedro Santos', reason: 'Apresentação de projeto de empreendedorismo social', status: 'confirmado' }
                    ].map((appointment, i) => (
                      <div key={i} className="flex items-start space-x-4 p-3 border rounded-lg">
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{appointment.time}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{appointment.name}</h3>
                            <Badge variant={appointment.status === 'confirmado' ? 'default' : 'outline'}>
                              {appointment.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4 mr-1" /> Perfil
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" /> Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Empty state */}
                    {false && (
                      <div className="flex flex-col items-center justify-center h-40 border rounded-lg border-dashed">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="font-medium">Nenhum agendamento</h3>
                        <p className="text-sm text-muted-foreground">Não há compromissos agendados para esta data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações Pendentes de Aprovação</CardTitle>
                <CardDescription>Solicitações de atendimento aguardando análise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '15/05/2023', name: 'Ana Luiza Pereira', reason: 'Discutir melhorias no posto de saúde do bairro', urgency: 'alta' },
                    { date: '18/05/2023', name: 'Carlos Eduardo Gomes', reason: 'Apresentar proposta de parceria público-privada', urgency: 'média' },
                    { date: '22/05/2023', name: 'Associação de Moradores Santa Fé', reason: 'Solicitar melhorias na iluminação pública', urgency: 'média' },
                    { date: '25/05/2023', name: 'Fernanda Araújo', reason: 'Discutir projeto de horta comunitária', urgency: 'baixa' }
                  ].map((request, i) => (
                    <div key={i} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{request.name}</h3>
                            <Badge 
                              className="ml-2" 
                              variant={
                                request.urgency === 'alta' ? 'destructive' : 
                                request.urgency === 'média' ? 'default' : 
                                'outline'
                              }
                            >
                              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                          <p className="text-xs text-muted-foreground">Solicitado para: {request.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                        <Button size="sm">Responder</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Lista de agendamentos aprovados em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Histórico de atendimentos em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AppointmentScheduler;
