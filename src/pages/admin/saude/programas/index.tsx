
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, Users } from "lucide-react";

export default function ProgramasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Programas de Saúde</h1>
          <p className="text-muted-foreground">
            Gerencie programas contínuos de atenção à saúde e seus participantes.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Programa
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar programa"
              className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Todas as categorias</option>
            <option value="hiperdia">Hiperdia</option>
            <option value="saude-mulher">Saúde da Mulher</option>
            <option value="tabagismo">Tabagismo</option>
            <option value="saude-mental">Saúde Mental</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="active">Ativos</option>
            <option value="all">Todos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "Hiperdia", category: "Doenças Crônicas", color: "bg-blue-500" },
          { name: "Saúde da Mulher", category: "Atenção Básica", color: "bg-pink-500" },
          { name: "Tabagismo", category: "Prevenção", color: "bg-amber-500" },
          { name: "Saúde Mental", category: "Psicossocial", color: "bg-purple-500" },
          { name: "Puericultura", category: "Infantil", color: "bg-green-500" },
          { name: "Gestantes de Risco", category: "Obstetrícia", color: "bg-red-500" },
        ].map((program, i) => (
          <Card key={i} className="overflow-hidden">
            <div className={`h-2 ${program.color}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{program.name}</CardTitle>
                <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Ativo
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {program.category}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Participantes:</span>
                  </div>
                  <span className="font-medium">{(i + 1) * 15}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Próximo encontro:</span>
                  </div>
                  <span className="font-medium">
                    {new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">Participantes</Button>
                  <Button size="sm" className="flex-1">Gerenciar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
