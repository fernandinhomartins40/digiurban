
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Filter, School, Building, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EscolasPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Escolas e CMEIs</h1>
          <p className="text-muted-foreground">
            Gerenciamento das unidades escolares municipais
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Unidade
        </Button>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="escolas">Escolas</TabsTrigger>
            <TabsTrigger value="cmeis">CMEIs</TabsTrigger>
            <TabsTrigger value="inativos">Inativos</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar unidade..."
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PlaceholderCard type="school" name="Escola Municipal João da Silva" />
            <PlaceholderCard type="cmei" name="CMEI Pequenos Passos" />
            <PlaceholderCard type="school" name="Escola Municipal Maria Oliveira" />
            <PlaceholderCard type="school" name="Escola Municipal Paulo Freire" />
            <PlaceholderCard type="cmei" name="CMEI Criança Feliz" />
          </div>
        </TabsContent>
        
        <TabsContent value="escolas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PlaceholderCard type="school" name="Escola Municipal João da Silva" />
            <PlaceholderCard type="school" name="Escola Municipal Maria Oliveira" />
            <PlaceholderCard type="school" name="Escola Municipal Paulo Freire" />
          </div>
        </TabsContent>
        
        <TabsContent value="cmeis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PlaceholderCard type="cmei" name="CMEI Pequenos Passos" />
            <PlaceholderCard type="cmei" name="CMEI Criança Feliz" />
          </div>
        </TabsContent>
        
        <TabsContent value="inativos" className="space-y-4">
          <div className="grid place-items-center h-40">
            <p className="text-muted-foreground text-center">
              Não há unidades escolares inativas no momento.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Fixed the type comparison issue by using proper string type comparison
const PlaceholderCard = ({ type, name }: { type: 'school' | 'cmei', name: string }) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${type === 'school' ? 'bg-blue-500' : 'bg-green-500'}`} />
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-md ${type === 'school' ? 'bg-blue-100' : 'bg-green-100'}`}>
            {type === 'school' ? (
              <School className="h-8 w-8 text-blue-500" />
            ) : (
              <Building className="h-8 w-8 text-green-500" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {type === 'school' ? 'Escola' : 'CMEI'} • Atualmente ativo
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm">Detalhes</Button>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
