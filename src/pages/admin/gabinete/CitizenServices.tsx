
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  FileText, 
  Calendar, 
  Package, 
  Clock,
  FileBarChart,
  Download,
  Filter,
  CalendarRange,
  AlertCircle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { searchCitizenServices } from '@/services/mayorOffice/citizenServicesService';
import { CitizenServiceDetails } from '@/components/gabinete/cidadaos/CitizenServiceDetails';

export default function CitizenServices() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  
  // Handle the search action
  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      refetch();
    }
  };

  // Query for citizen services
  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['citizenServices', searchType, searchQuery, serviceTypeFilter, dateFilter, statusFilter],
    queryFn: () => searchCitizenServices({
      searchType,
      searchValue: searchQuery,
      serviceType: serviceTypeFilter !== 'all' ? serviceTypeFilter : undefined,
      dateRange: dateFilter !== 'all' ? dateFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }),
    enabled: isSearching,
  });

  // Handle service item click
  const handleServiceClick = (serviceId: string, serviceType: string) => {
    setSelectedServiceId(serviceId);
    setSelectedServiceType(serviceType);
  };

  // Format date from ISO to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Get appropriate badge variant based on status
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

  // Get icon based on service type
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'appointment':
        return <Calendar className="h-5 w-5 mr-2" />;
      case 'direct_request':
        return <FileText className="h-5 w-5 mr-2" />;
      case 'benefit':
        return <Package className="h-5 w-5 mr-2" />;
      case 'social':
        return <User className="h-5 w-5 mr-2" />;
      case 'program':
        return <FileBarChart className="h-5 w-5 mr-2" />;
      default:
        return <Clock className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Serviços por Cidadão | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Serviços por Cidadão</h1>
          <p className="text-sm text-muted-foreground">
            Consulte os serviços e atendimentos prestados aos cidadãos
          </p>
        </div>

        <Button variant="outline" onClick={() => refetch()}>
          <Search className="mr-2 h-4 w-4" /> Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Busca de Cidadão</CardTitle>
          <CardDescription>
            Pesquise por nome, CPF ou outro identificador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo de busca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-full"
                placeholder={
                  searchType === 'name' ? "Nome do cidadão..." :
                  searchType === 'cpf' ? "CPF do cidadão..." :
                  searchType === 'id' ? "ID do cidadão..." :
                  "Email do cidadão..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <Button className="md:w-[100px]" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearching && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Resultados da Busca</CardTitle>
                <CardDescription>
                  {isLoading ? "Buscando serviços..." : 
                    services && services.length > 0 ? 
                    `${services.length} serviços encontrados` : 
                    "Nenhum serviço encontrado"}
                </CardDescription>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <Separator className="mb-4" />
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : services && services.length > 0 ? (
              <>
                {/* Citizen Information */}
                {services[0]?.citizen && (
                  <div className="bg-muted/40 p-4 rounded-lg mb-6 border">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{services[0].citizen.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          CPF: {services[0].citizen.cpf || 'Não informado'} • 
                          Email: {services[0].citizen.email || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter tabs */}
                <div className="mb-4">
                  <Tabs defaultValue="all" value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                    <TabsList className="grid grid-cols-2 md:grid-cols-5">
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="appointment">Agendamentos</TabsTrigger>
                      <TabsTrigger value="direct_request">Solicitações</TabsTrigger>
                      <TabsTrigger value="benefit">Benefícios</TabsTrigger>
                      <TabsTrigger value="program">Programas</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Services list */}
                <div className="space-y-4">
                  {services.map((service) => (
                    <div 
                      key={`${service.type}-${service.id}`}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleServiceClick(service.id, service.type)}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          {getServiceIcon(service.type)}
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.protocol && (
                                <span className="mr-2">Protocolo: {service.protocol}</span>
                              )}
                              {service.date && (
                                <span>Data: {formatDate(service.date)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant={getStatusBadge(service.status).variant}>
                            {getStatusBadge(service.status).label}
                          </Badge>
                          <span className="text-xs text-muted-foreground mt-1">
                            {service.type === 'appointment' && 'Agendamento'}
                            {service.type === 'direct_request' && 'Solicitação'}
                            {service.type === 'benefit' && 'Benefício'}
                            {service.type === 'social' && 'Atendimento Social'}
                            {service.type === 'program' && 'Programa Social'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">Nenhum serviço encontrado</h3>
                <p className="text-muted-foreground max-w-md mt-1">
                  Não foram encontrados serviços para o cidadão com os critérios de busca informados.
                  Tente ajustar os parâmetros de busca.
                </p>
              </div>
            )}
          </CardContent>
          
          {services && services.length > 0 && (
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {services.length} serviços
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Service details component */}
      <CitizenServiceDetails
        serviceId={selectedServiceId}
        serviceType={selectedServiceType}
        isOpen={!!selectedServiceId}
        onClose={() => {
          setSelectedServiceId(null);
          setSelectedServiceType(null);
        }}
      />
    </div>
  );
}
