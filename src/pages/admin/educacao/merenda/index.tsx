
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchSchoolMeals, createMealMenu, updateMealMenu } from "@/services/education";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Utensils, Search, Filter, Plus, Calendar, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SchoolMeal } from "@/types/education";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MerendaPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterShift, setFilterShift] = useState<string>("");
  const [showMealDetail, setShowMealDetail] = useState<boolean>(false);
  const [showMealForm, setShowMealForm] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<SchoolMeal | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("cardapios");

  // Fetch meal menus
  const { data: menus, isLoading, refetch } = useQuery({
    queryKey: ['education-meal-menus'],
    queryFn: () => fetchSchoolMeals(),
  });

  // Filter menus
  const filteredMenus = menus?.filter(menu => {
    // Filter by search term
    if (searchTerm && !(
      menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Filter by shift
    if (filterShift && menu.shift !== filterShift) {
      return false;
    }
    
    return true;
  }) || [];

  // Form for creating/editing meal menus
  const form = useForm({
    defaultValues: {
      name: "",
      school_id: "",
      shift: "lunch",
      active_from: new Date(),
      menu_items: [""],
      nutritional_info: "",
      year: new Date().getFullYear()
    }
  });

  // Handle meal form submission
  const handleSubmitMeal = async (data: any) => {
    try {
      // Ensure menu_items is an array
      if (typeof data.menu_items === 'string') {
        data.menu_items = data.menu_items.split('\n').filter(Boolean);
      }
      
      if (isEditing && selectedMeal) {
        await updateMealMenu(selectedMeal.id, data);
        toast({
          title: "Sucesso",
          description: "Cardápio atualizado com sucesso.",
        });
      } else {
        await createMealMenu(data);
        toast({
          title: "Sucesso",
          description: "Cardápio criado com sucesso.",
        });
      }
      
      // Refresh menus
      refetch();
      
      // Close form
      setShowMealForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling meal menu:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cardápio.",
        variant: "destructive",
      });
    }
  };

  // Functions for handling meal menu actions
  const handleViewMeal = (menu: SchoolMeal) => {
    setSelectedMeal(menu);
    setShowMealDetail(true);
  };

  const handleEditMeal = (menu: SchoolMeal) => {
    setSelectedMeal(menu);
    setIsEditing(true);
    
    // Populate form with meal data
    form.reset({
      name: menu.name,
      school_id: menu.school_id,
      shift: menu.shift,
      active_from: new Date(menu.active_from || menu.date),
      menu_items: menu.menu_items,
      nutritional_info: menu.nutritional_info,
      year: menu.year
    });
    
    setShowMealForm(true);
  };

  const handleAddMeal = () => {
    setSelectedMeal(null);
    setIsEditing(false);
    
    // Reset form
    form.reset({
      name: "",
      school_id: "",
      shift: "lunch",
      active_from: new Date(),
      menu_items: [""],
      nutritional_info: "",
      year: new Date().getFullYear()
    });
    
    setShowMealForm(true);
  };

  // Helper function to get shift label
  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'breakfast': return 'Café da manhã';
      case 'lunch': return 'Almoço';
      case 'snack': return 'Lanche';
      case 'dinner': return 'Jantar';
      default: return shift;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Merenda Escolar</h2>
          <p className="text-muted-foreground">
            Gerenciamento de cardápios e alimentação dos alunos.
          </p>
        </div>
        <Button onClick={handleAddMeal} className="flex items-center gap-2">
          <Utensils className="h-4 w-4" />
          <span>Novo Cardápio</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cardápios..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterShift} onValueChange={setFilterShift}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filterShift ? getShiftLabel(filterShift) : "Filtrar refeição"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {/* FIX: Replace empty string value with a non-empty value */}
            <SelectItem value="all">Todas as refeições</SelectItem>
            <SelectItem value="breakfast">Café da manhã</SelectItem>
            <SelectItem value="lunch">Almoço</SelectItem>
            <SelectItem value="snack">Lanche</SelectItem>
            <SelectItem value="dinner">Jantar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="cardapios">Cardápios</TabsTrigger>
          <TabsTrigger value="dietas">Dietas Especiais</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="cardapios" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Carregando cardápios...</p>
            </div>
          ) : filteredMenus.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMenus.map((menu) => (
                <Card key={menu.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{menu.name}</CardTitle>
                      <Badge variant="outline" className="uppercase">
                        {getShiftLabel(menu.shift)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {menu.school_name} - {new Date(menu.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Data: {format(new Date(menu.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
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
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewMeal(menu)}>
                      Ver detalhes
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditMeal(menu)}>
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cardápios de Merenda Escolar</CardTitle>
                <CardDescription>
                  {searchTerm || filterShift ? 
                    "Não foram encontrados cardápios com os filtros selecionados." : 
                    "Ainda não há cardápios cadastrados no sistema."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="mb-4">
                    {searchTerm || filterShift ? 
                      "Tente ajustar os filtros para encontrar mais resultados." : 
                      "Comece cadastrando o primeiro cardápio para a merenda escolar."}
                  </p>
                  {!searchTerm && !filterShift && (
                    <Button onClick={handleAddMeal}>
                      <Utensils className="mr-2 h-4 w-4" />
                      Cadastrar Cardápio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dietas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dietas Especiais</CardTitle>
              <CardDescription>
                Gerenciamento de alunos com restrições alimentares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <h3 className="text-lg font-semibold mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Esta seção para gerenciamento de dietas especiais está em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estoque" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Estoque</CardTitle>
              <CardDescription>
                Monitoramento de ingredientes e suprimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <h3 className="text-lg font-semibold mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Esta seção para controle de estoque da merenda escolar está em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Meal Detail Dialog */}
      <Dialog open={showMealDetail} onOpenChange={setShowMealDetail}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cardápio</DialogTitle>
          </DialogHeader>
          {selectedMeal && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedMeal.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedMeal.school_name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Refeição</Label>
                  <p>{getShiftLabel(selectedMeal.shift)}</p>
                </div>
                <div>
                  <Label>Data</Label>
                  <p>{format(new Date(selectedMeal.date), "dd/MM/yyyy")}</p>
                </div>
              </div>
              
              <div>
                <Label>Itens do Cardápio</Label>
                <ul className="list-disc pl-5 mt-1">
                  {selectedMeal.menu_items?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              {selectedMeal.nutritional_info && (
                <div>
                  <Label>Informações Nutricionais</Label>
                  <p className="whitespace-pre-line">{selectedMeal.nutritional_info}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowMealDetail(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setShowMealDetail(false);
                  handleEditMeal(selectedMeal);
                }}>
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Meal Form Dialog */}
      <Dialog open={showMealForm} onOpenChange={setShowMealForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Cardápio" : "Novo Cardápio"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize as informações do cardápio de merenda escolar."
                : "Adicione um novo cardápio de merenda escolar."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitMeal)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cardápio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cardápio Semanal - Educação Infantil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="school_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma escola" />
                        </SelectTrigger>
                        <SelectContent>
                          {menus?.map(menu => menu.school_id).filter((v, i, a) => a.indexOf(v) === i).map(schoolId => {
                            const menu = menus.find(m => m.school_id === schoolId);
                            return (
                              <SelectItem key={schoolId} value={schoolId}>
                                {menu?.school_name || 'Escola'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refeição</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de refeição" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Café da manhã</SelectItem>
                            <SelectItem value="lunch">Almoço</SelectItem>
                            <SelectItem value="snack">Lanche</SelectItem>
                            <SelectItem value="dinner">Jantar</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => date && field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="menu_items"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itens do Cardápio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Liste os itens do cardápio (um por linha)"
                        className="min-h-[120px]"
                        value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                        onChange={(e) => field.onChange(e.target.value.split('\n'))}
                      />
                    </FormControl>
                    <FormDescription>
                      Adicione cada item em uma linha separada.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nutritional_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informações Nutricionais</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações nutricionais do cardápio"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" type="button" onClick={() => setShowMealForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditing ? "Salvar Alterações" : "Criar Cardápio"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
