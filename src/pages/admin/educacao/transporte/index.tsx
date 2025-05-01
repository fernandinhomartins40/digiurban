
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Bus, Filter, Search, Plus } from "lucide-react";
import { fetchTransportRequests } from "@/services/education";
import { TransportRequestForm } from "@/components/education/transport/TransportRequestForm";
import { TransportRequestList } from "@/components/education/transport/TransportRequestList";
import { toast } from "@/hooks/use-toast";

export default function TransportePage() {
  const [isNewRequestOpen, setIsNewRequestOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: transportRequests, isLoading, error, refetch } = useQuery({
    queryKey: ['transport-requests'],
    queryFn: fetchTransportRequests
  });

  const handleSuccess = () => {
    setIsNewRequestOpen(false);
    refetch();
    toast({
      title: "Solicitação criada",
      description: "A solicitação de transporte foi criada com sucesso.",
    });
  };

  if (error) {
    console.error("Error fetching transport requests:", error);
    toast({
      variant: "destructive",
      title: "Erro ao carregar solicitações",
      description: "Ocorreu um erro ao carregar as solicitações de transporte."
    });
  }

  const filteredRequests = transportRequests?.filter(request => 
    request.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    request.school_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    request.protocol_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transporte Escolar</h1>
          <p className="text-muted-foreground">
            Gerenciamento de solicitações de transporte escolar
          </p>
        </div>
        <Sheet open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nova Solicitação de Transporte</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <TransportRequestForm onSuccess={handleSuccess} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar solicitação..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Carregando solicitações...</p>
              </div>
            </Card>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            <TransportRequestList requests={filteredRequests} onStatusChange={refetch} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[200px]">
                <Bus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhuma solicitação encontrada</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? "Tente mudar os filtros de busca" : "Cadastre uma nova solicitação de transporte escolar"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </Card>
          ) : filteredRequests ? (
            <TransportRequestList 
              requests={filteredRequests.filter(req => req.status === 'pending')} 
              onStatusChange={refetch} 
            />
          ) : null}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </Card>
          ) : filteredRequests ? (
            <TransportRequestList 
              requests={filteredRequests.filter(req => req.status === 'approved')} 
              onStatusChange={refetch} 
            />
          ) : null}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </Card>
          ) : filteredRequests ? (
            <TransportRequestList 
              requests={filteredRequests.filter(req => req.status === 'rejected')} 
              onStatusChange={refetch} 
            />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
