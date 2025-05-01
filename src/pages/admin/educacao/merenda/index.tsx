
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchSchoolMeals } from "@/services/education";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

export default function MerendaPage() {
  const { data: menus, isLoading } = useQuery({
    queryKey: ['education-meal-menus'],
    queryFn: () => fetchSchoolMeals(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Merenda Escolar</h2>
          <p className="text-muted-foreground">
            Gerenciamento de cardápios e alimentação dos alunos.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Utensils className="h-4 w-4" />
          <span>Novo Cardápio</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Carregando cardápios...</p>
        </div>
      ) : menus && menus.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{menu.name}</CardTitle>
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>
                  {menu.school_name} - {menu.shift}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Data:</span> {new Date(menu.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    <span className="font-medium">Itens do cardápio:</span>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {menu.menu_items && menu.menu_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {menu.nutritional_info && (
                    <div>
                      <span className="font-medium">Info nutricional:</span>
                      <p className="text-sm">{menu.nutritional_info}</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">Ver detalhes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cardápios de Merenda Escolar</CardTitle>
            <CardDescription>
              Ainda não há cardápios cadastrados no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="mb-4">Comece cadastrando o primeiro cardápio para a merenda escolar.</p>
              <Button>
                <Utensils className="mr-2 h-4 w-4" />
                Cadastrar Cardápio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Gestão da Alimentação Escolar</CardTitle>
          <CardDescription>
            Recursos disponíveis para administração da merenda escolar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Cardápios Semanais</div>
              <p className="text-sm text-muted-foreground">Planejamento de refeições para as escolas</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Dietas Especiais</div>
              <p className="text-sm text-muted-foreground">Gerenciamento de alunos com restrições alimentares</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Controle de Estoque</div>
              <p className="text-sm text-muted-foreground">Monitoramento de ingredientes e suprimentos</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Feedback dos Alunos</div>
              <p className="text-sm text-muted-foreground">Avaliações e sugestões sobre as refeições</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Nutricionistas</div>
              <p className="text-sm text-muted-foreground">Equipe responsável pelo planejamento nutricional</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Relatórios</div>
              <p className="text-sm text-muted-foreground">Estatísticas e dados sobre a merenda escolar</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
