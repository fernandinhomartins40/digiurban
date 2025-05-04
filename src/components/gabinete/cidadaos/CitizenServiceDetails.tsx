
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getServiceDetails } from '@/services/mayorOffice/citizenServicesService';
import { 
  CalendarClock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Package,
  FileBarChart,
  Clock,
  Calendar,
  Loader2
} from 'lucide-react';

interface CitizenServiceDetailsProps {
  serviceId: string | null;
  serviceType: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CitizenServiceDetails({
  serviceId,
  serviceType,
  isOpen,
  onClose,
}: CitizenServiceDetailsProps) {
  // Fetch service details when both ID and type are available
  const { data: serviceDetails, isLoading } = useQuery({
    queryKey: ['serviceDetails', serviceType, serviceId],
    queryFn: () => getServiceDetails(serviceType!, serviceId!),
    enabled: isOpen && !!serviceId && !!serviceType,
  });

  // Format date helper function
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      // Appointments
      pending: { variant: 'secondary', label: 'Pendente' },
      approved: { variant: 'default', label: 'Aprovado' },
      rejected: { variant: 'destructive', label: 'Rejeitado' },
      completed: { variant: 'outline', label: 'Concluído' },
      cancelled: { variant: 'destructive', label: 'Cancelado' },
      
      // Direct requests
      open: { variant: 'secondary', label: 'Aberto' },
      in_progress: { variant: 'default', label: 'Em Andamento' },
      
      // Benefits
      approved_benefit: { variant: 'default', label: 'Aprovado' },
      pending_benefit: { variant: 'secondary', label: 'Pendente' },
      rejected_benefit: { variant: 'destructive', label: 'Rejeitado' },
      delivered: { variant: 'outline', label: 'Entregue' },
      
      // Default
      active: { variant: 'default', label: 'Ativo' },
      inactive: { variant: 'outline', label: 'Inativo' },
    };
    
    return statusMap[status] || { variant: 'secondary', label: status };
  };

  // Get the title based on service type
  const getServiceTitle = () => {
    switch (serviceType) {
      case 'appointment': return 'Detalhes do Agendamento';
      case 'direct_request': return 'Detalhes da Solicitação';
      case 'benefit': return 'Detalhes do Benefício';
      case 'social': return 'Detalhes do Atendimento Social';
      case 'program': return 'Detalhes do Programa Social';
      default: return 'Detalhes do Serviço';
    }
  };

  // Get the icon based on service type
  const getServiceIcon = () => {
    switch (serviceType) {
      case 'appointment': return <Calendar className="h-5 w-5 mr-2" />;
      case 'direct_request': return <FileText className="h-5 w-5 mr-2" />;
      case 'benefit': return <Package className="h-5 w-5 mr-2" />;
      case 'social': return <User className="h-5 w-5 mr-2" />;
      case 'program': return <FileBarChart className="h-5 w-5 mr-2" />;
      default: return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg md:max-w-xl pt-10 overflow-y-auto">
        <SheetHeader className="flex flex-row items-center gap-2 pb-2">
          {getServiceIcon()}
          <div>
            <SheetTitle>{getServiceTitle()}</SheetTitle>
            <SheetDescription>
              {serviceDetails?.protocol && `Protocolo: ${serviceDetails.protocol}`}
            </SheetDescription>
          </div>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando detalhes...</p>
          </div>
        ) : serviceDetails ? (
          <div className="space-y-5 py-6">
            <div>
              <h3 className="text-lg font-semibold">{serviceDetails.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                {serviceDetails.status && (
                  <Badge variant={getStatusBadge(serviceDetails.status).variant}>
                    {getStatusBadge(serviceDetails.status).label}
                  </Badge>
                )}
                {serviceDetails.priority && (
                  <Badge variant="outline" className="bg-muted/50">
                    {serviceDetails.priority === "low" && "Baixa prioridade"}
                    {serviceDetails.priority === "normal" && "Prioridade normal"}
                    {serviceDetails.priority === "high" && "Alta prioridade"}
                    {serviceDetails.priority === "urgent" && "Prioridade urgente"}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Citizen Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dados do Cidadão</h4>
              <div className="space-y-1">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Nome:</strong> {serviceDetails.citizenName}
                  </span>
                </div>
                {serviceDetails.citizenEmail && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Email:</strong> {serviceDetails.citizenEmail}
                    </span>
                  </div>
                )}
                {serviceDetails.citizenPhone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Telefone:</strong> {serviceDetails.citizenPhone}
                    </span>
                  </div>
                )}
                {serviceDetails.citizenAddress && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Endereço:</strong> {serviceDetails.citizenAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Service Information - Varies by Type */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Informações do Serviço</h4>
              
              {/* Date Information */}
              <div className="space-y-1">
                {serviceDetails.date && (
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Data:</strong> {formatDate(serviceDetails.date)}
                    </span>
                  </div>
                )}
                {serviceDetails.time && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Horário:</strong> {serviceDetails.time}
                      {serviceDetails.duration && ` (${serviceDetails.duration} minutos)`}
                    </span>
                  </div>
                )}
                {serviceDetails.createdAt && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Criado em:</strong> {formatDate(serviceDetails.createdAt)}
                    </span>
                  </div>
                )}
                {serviceDetails.dueDate && (
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Data limite:</strong> {formatDate(serviceDetails.dueDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Department/Target Information */}
              {serviceDetails.department && (
                <div className="flex items-center mt-2">
                  <FileBarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Departamento:</strong> {serviceDetails.department}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            {serviceDetails.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">Descrição</h4>
                <p className="text-sm border rounded-md p-3 bg-muted/30">
                  {serviceDetails.description}
                </p>
              </div>
            )}

            {/* Notes/Comments/Observations */}
            {serviceDetails.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Observações</h4>
                  <p className="text-sm border rounded-md p-3 bg-muted/30">
                    {serviceDetails.notes}
                  </p>
                </div>
              </>
            )}

            {/* Additional specific fields based on service type */}
            {serviceType === 'benefit' && serviceDetails.benefitType && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Tipo de Benefício</h4>
                  <Badge variant="outline">{serviceDetails.benefitType}</Badge>
                </div>
              </>
            )}

            {serviceType === 'program' && serviceDetails.programDetails && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Detalhes do Programa</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Início:</strong> {formatDate(serviceDetails.programDetails.startDate)}</p>
                    {serviceDetails.programDetails.endDate && (
                      <p className="text-sm"><strong>Término:</strong> {formatDate(serviceDetails.programDetails.endDate)}</p>
                    )}
                    <p className="text-sm"><strong>Status:</strong> {serviceDetails.programDetails.status}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60">
            <FileText className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhum detalhe disponível</p>
          </div>
        )}
        
        <SheetFooter>
          <Button onClick={onClose}>Fechar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
