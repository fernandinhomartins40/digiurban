
import React, { useState } from "react";
import { ObrasLayout } from "../components/ObrasLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Filter, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for small works
const pequenasObrasMock = [
  {
    id: 1,
    nome: "Pintura de Faixa de Pedestres",
    local: "Av. Principal com Rua 7",
    solicitante: "Secretaria de Trânsito",
    dataRequisicao: "2025-04-15",
    prioridade: "media",
    status: "aprovada",
    responsavel: "Equipe A"
  },
  {
    id: 2,
    nome: "Reparo de Bueiro",
    local: "Rua do Comércio, 250",
    solicitante: "Vigilância Sanitária",
    dataRequisicao: "2025-04-12",
    prioridade: "alta",
    status: "em_execucao",
    responsavel: "Equipe B"
  },
  {
    id: 3,
    nome: "Instalação de Placa de Sinalização",
    local: "Rua das Palmeiras",
    solicitante: "Associação de Moradores",
    dataRequisicao: "2025-04-10",
    prioridade: "baixa",
    status: "aguardando",
    responsavel: "A definir"
  },
  {
    id: 4,
    nome: "Conserto de Calçada",
    local: "Praça Central",
    solicitante: "Gabinete do Prefeito",
    dataRequisicao: "2025-04-08",
    prioridade: "media",
    status: "concluida",
    responsavel: "Equipe A"
  },
  {
    id: 5,
    nome: "Substituição de Lâmpada de Poste",
    local: "Rua das Flores, 123",
    solicitante: "Cidadão",
    dataRequisicao: "2025-04-05",
    prioridade: "baixa",
    status: "concluida",
    responsavel: "Equipe C"
  },
];

export default function PequenasObrasIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [prioridadeFilter, setPrioridadeFilter] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [openNewObraDialog, setOpenNewObraDialog] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aguardando':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Aguardando</Badge>;
      case 'aprovada':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Aprovada</Badge>;
      case 'em_execucao':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Em execução</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Concluída</Badge>;
      case 'cancelada':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getPrioridadeBadge = (prioridade: string) => {
    switch(prioridade) {
      case 'baixa':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Baixa</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Média</Badge>;
      case 'alta':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Alta</Badge>;
      default:
        return <Badge variant="outline">Desconhecida</Badge>;
    }
  };

  const filteredObras = pequenasObrasMock.filter(obra => {
    const matchesQuery = obra.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        obra.local.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || obra.status === statusFilter;
    const matchesPrioridade = prioridadeFilter === "" || obra.prioridade === prioridadeFilter;
    
    let matchesData = true;
    if (dataInicio && dataFim) {
      const obraDate = new Date(obra.dataRequisicao);
      matchesData = obraDate >= dataInicio && obraDate <= dataFim;
    }
    
    return matchesQuery && matchesStatus && matchesPrioridade && matchesData;
  });

  return (
    <ObrasLayout title="Pequenas Obras" description="Gestão de pequenas obras e reparos urbanos">
      <div className="space-y-4">
        {/* Filtros e Pesquisa */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar obras..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filtrar por</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="aguardando">Aguardando</SelectItem>
                        <SelectItem value="aprovada">Aprovada</SelectItem>
                        <SelectItem value="em_execucao">Em execução</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prioridade</label>
                    <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Período</label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataInicio ? format(dataInicio, 'dd/MM/yyyy') : 'De'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dataInicio}
                            onSelect={setDataInicio}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataFim ? format(dataFim, 'dd/MM/yyyy') : 'Até'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dataFim}
                            onSelect={setDataFim}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => {
                      setStatusFilter("");
                      setPrioridadeFilter("");
                      setDataInicio(undefined);
                      setDataFim(undefined);
                    }}>
                      Limpar
                    </Button>
                    <Button>Aplicar Filtros</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={openNewObraDialog} onOpenChange={setOpenNewObraDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Obra
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Nova Pequena Obra</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para cadastrar uma nova pequena obra ou reparo.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome da Obra</label>
                      <Input placeholder="Digite o nome da obra" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Local</label>
                      <Input placeholder="Digite o endereço/local da obra" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Solicitante</label>
                        <Input placeholder="Nome do solicitante" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prioridade</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição</label>
                      <textarea 
                        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-transparent"
                        placeholder="Descreva detalhes da obra ou reparo necessário"
                      ></textarea>
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNewObraDialog(false)}>Cancelar</Button>
                  <Button onClick={() => setOpenNewObraDialog(false)}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="todas">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="aguardando">Aguardando</TabsTrigger>
            <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
            <TabsTrigger value="em_execucao">Em Execução</TabsTrigger>
            <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todas" className="mt-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObras.length > 0 ? (
                    filteredObras.map((obra) => (
                      <TableRow key={obra.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{obra.nome}</TableCell>
                        <TableCell>{obra.local}</TableCell>
                        <TableCell>{obra.solicitante}</TableCell>
                        <TableCell>{new Date(obra.dataRequisicao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{getPrioridadeBadge(obra.prioridade)}</TableCell>
                        <TableCell>{getStatusBadge(obra.status)}</TableCell>
                        <TableCell>{obra.responsavel}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        Nenhuma obra encontrada com os filtros aplicados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="aguardando" className="mt-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObras.filter(o => o.status === 'aguardando').length > 0 ? (
                    filteredObras.filter(o => o.status === 'aguardando').map((obra) => (
                      <TableRow key={obra.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{obra.nome}</TableCell>
                        <TableCell>{obra.local}</TableCell>
                        <TableCell>{obra.solicitante}</TableCell>
                        <TableCell>{new Date(obra.dataRequisicao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{getPrioridadeBadge(obra.prioridade)}</TableCell>
                        <TableCell>{obra.responsavel}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma obra aguardando aprovação encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Outros TabsContent seguiriam o mesmo padrão */}
          <TabsContent value="aprovadas" className="mt-4">
            {/* Conteúdo similar ao anterior, filtrando obras com status 'aprovada' */}
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Lista de obras aprovadas
            </div>
          </TabsContent>
          
          <TabsContent value="em_execucao" className="mt-4">
            {/* Conteúdo similar ao anterior, filtrando obras com status 'em_execucao' */}
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Lista de obras em execução
            </div>
          </TabsContent>
          
          <TabsContent value="concluidas" className="mt-4">
            {/* Conteúdo similar ao anterior, filtrando obras com status 'concluida' */}
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Lista de obras concluídas
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ObrasLayout>
  );
}
