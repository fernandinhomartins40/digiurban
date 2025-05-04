
import React from "react";
import { HabitacaoLayout } from "../components/HabitacaoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function InscricoesHabitacionais() {
  const inscricoes = [
    {
      id: "INS-2023-001",
      nome: "Maria da Silva",
      cpf: "123.456.789-00",
      programa: "Minha Casa Municipal",
      data: "15/03/2023",
      renda: 1800,
      status: "Aprovada",
    },
    {
      id: "INS-2023-015",
      nome: "João Pereira",
      cpf: "987.654.321-00",
      programa: "Minha Casa Municipal",
      data: "22/03/2023",
      renda: 1650,
      status: "Em análise",
    },
    {
      id: "INS-2023-023",
      nome: "Ana Ferreira",
      cpf: "456.789.123-00",
      programa: "Reforma Solidária",
      data: "05/04/2023",
      renda: 1450,
      status: "Aprovada",
    },
    {
      id: "INS-2023-037",
      nome: "Carlos Santos",
      cpf: "789.123.456-00",
      programa: "Minha Casa Municipal",
      data: "18/04/2023",
      renda: 2100,
      status: "Reprovada",
    },
    {
      id: "INS-2023-042",
      nome: "Juliana Lima",
      cpf: "321.654.987-00",
      programa: "Reforma Solidária",
      data: "02/05/2023",
      renda: 1700,
      status: "Em análise",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "success";
      case "Reprovada":
        return "destructive";
      case "Em análise":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <HabitacaoLayout title="Inscrições" description="Gestão de inscrições em programas habitacionais">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Lista de Inscrições</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar inscrição..."
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Renda (R$)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscricoes.map((inscricao) => (
                  <TableRow key={inscricao.id}>
                    <TableCell className="font-medium">{inscricao.id}</TableCell>
                    <TableCell>{inscricao.nome}</TableCell>
                    <TableCell>{inscricao.cpf}</TableCell>
                    <TableCell>{inscricao.programa}</TableCell>
                    <TableCell>{inscricao.data}</TableCell>
                    <TableCell>{inscricao.renda.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(inscricao.status) as any}>
                        {inscricao.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </HabitacaoLayout>
  );
}
