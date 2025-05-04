
import React, { useState } from "react";
import { MeioAmbienteLayout } from "../components/MeioAmbienteLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, Megaphone, Search, Users, Banknote, Target, ArrowRightCircle, Plus } from "lucide-react";

// Mock data for environmental campaigns
const campaignsMock = [
  {
    id: 1,
    title: "Semana da Água",
    target: "Escolas Municipais",
    startDate: "2025-05-22",
    endDate: "2025-05-29",
    status: "próxima",
    budget: "R$ 15.000,00",
    reach: 5000,
    description: "Semana educativa sobre a importância da conservação da água, com atividades em todas as escolas do município.",
    imageUrl: "https://images.unsplash.com/photo-1520782952576-d474af1bb088"
  },
  {
    id: 2,
    title: "Dia da Árvore",
    target: "População Geral",
    startDate: "2025-09-21",
    endDate: "2025-09-21",
    status: "futura",
    budget: "R$ 8.500,00",
    reach: 3000,
    description: "Plantio de mudas nativas em áreas de recuperação ambiental e distribuição de mudas para a população.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
  },
  {
    id: 3,
    title: "Recicle Mais",
    target: "Bairros Residenciais",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: "ativa",
    budget: "R$ 22.000,00",
    reach: 8000,
    description: "Campanha de incentivo à reciclagem com pontos de coleta e premiação para os bairros que mais reciclarem.",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"
  },
  {
    id: 4,
    title: "Limpeza de Praias",
    target: "Voluntários",
    startDate: "2025-07-15",
    endDate: "2025-07-17",
    status: "futura",
    budget: "R$ 5.000,00",
    reach: 1200,
    description: "Mutirão de limpeza das praias do município, com participação de voluntários e escolas.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"
  },
  {
    id: 5,
    title: "Economia de Energia",
    target: "Comércio e Indústria",
    startDate: "2025-03-01",
    endDate: "2025-04-30",
    status: "concluída",
    budget: "R$ 18.000,00",
    reach: 2500,
    description: "Campanha de conscientização sobre uso eficiente de energia em estabelecimentos comerciais e industriais.",
    imageUrl: "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5"
  },
  {
    id: 6,
    title: "Consumo Consciente",
    target: "População Geral",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    status: "ativa",
    budget: "R$ 12.500,00",
    reach: 7500,
    description: "Campanha educativa sobre redução do consumo e escolha de produtos menos impactantes ao meio ambiente.",
    imageUrl: "https://images.unsplash.com/photo-1536939459926-301728717817"
  },
];

export default function CampanhasIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ativa":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Ativa</Badge>;
      case "próxima":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Próxima</Badge>;
      case "futura":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Futura</Badge>;
      case "concluída":
        return <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-400">Concluída</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  // Filter campaigns based on search term and filters
  const filteredCampaigns = campaignsMock.filter(campaign => {
    const matchesSearch = searchTerm === "" || 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesTarget = targetFilter === "all" || campaign.target === targetFilter;
    
    return matchesSearch && matchesStatus && matchesTarget;
  });
  
  // Get unique targets for filter
  const targets = Array.from(new Set(campaignsMock.map(c => c.target)));
  
  return (
    <MeioAmbienteLayout 
      title="Campanhas Ambientais" 
      description="Gerenciamento de campanhas de conscientização ambiental"
    >
      <div className="space-y-4">
        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar campanhas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="próxima">Próxima</SelectItem>
                <SelectItem value="futura">Futura</SelectItem>
                <SelectItem value="concluída">Concluída</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={targetFilter} onValueChange={setTargetFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Público-alvo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os públicos</SelectItem>
                {targets.map(target => (
                  <SelectItem key={target} value={target}>{target}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <Plus size={16} />
              Nova Campanha
            </Button>
          </div>
        </div>
        
        {/* Campaigns grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(campaign.status)}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{new Date(campaign.startDate).toLocaleDateString('pt-BR')} - {new Date(campaign.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={14} className="text-muted-foreground" />
                    <span className="truncate">{campaign.target}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-muted-foreground" />
                    <span>{campaign.reach.toLocaleString()} pessoas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Banknote size={14} className="text-muted-foreground" />
                    <span>{campaign.budget}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <Megaphone size={14} />
                  Materiais
                </Button>
                <Button variant="secondary" size="sm" className="gap-1">
                  <ArrowRightCircle size={14} />
                  Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma campanha encontrada.</p>
          </div>
        )}
      </div>
    </MeioAmbienteLayout>
  );
}
