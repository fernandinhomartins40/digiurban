
import React, { useState } from "react";
import { AgriculturaLayout } from "../components/AgriculturaLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search, 
  Plus, 
  FileEdit, 
  Trash2 
} from "lucide-react";
import { useDemo } from "./hooks/useDemo";
import { Badge } from "@/components/ui/badge";

export default function ProdutoresRuraisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { produtores } = useDemo();

  const filteredProdutores = produtores.filter(produtor =>
    produtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produtor.cpf.includes(searchTerm)
  );

  return (
    <AgriculturaLayout 
      title="Produtores Rurais" 
      description="Cadastro e gestão dos produtores rurais do município"
    >
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center w-full md:w-auto relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou CPF..."
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produtor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Área (ha)</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutores.length > 0 ? (
                  filteredProdutores.map((produtor) => (
                    <TableRow key={produtor.id}>
                      <TableCell className="font-medium">{produtor.nome}</TableCell>
                      <TableCell>{produtor.cpf}</TableCell>
                      <TableCell>{produtor.propriedade}</TableCell>
                      <TableCell>{produtor.area}</TableCell>
                      <TableCell>
                        <Badge variant={produtor.situacao === "Ativo" ? "default" : "secondary"}>
                          {produtor.situacao}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Editar">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum produtor encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando <strong>1</strong> a <strong>{filteredProdutores.length}</strong> de{" "}
                <strong>{produtores.length}</strong> produtores
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgriculturaLayout>
  );
}
