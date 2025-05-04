
import { useState } from "react";

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string | null;
  status: string;
  progresso: number;
  coordenador: string;
  beneficiarios: number;
  orcamento: number;
  area: string;
}

export function useProjetos() {
  const [projetos] = useState<Projeto[]>([
    {
      id: "1",
      nome: "Irrigação Sustentável",
      descricao: "Implantação de sistema de irrigação por gotejamento em pequenas propriedades",
      dataInicio: "2023-02-15",
      dataFim: "2023-12-15",
      status: "Em Andamento",
      progresso: 65,
      coordenador: "Marcos Oliveira",
      beneficiarios: 25,
      orcamento: 120000,
      area: "Infraestrutura"
    },
    {
      id: "2",
      nome: "Horta Comunitária",
      descricao: "Criação de hortas comunitárias em áreas urbanas para agricultura familiar",
      dataInicio: "2023-03-10",
      dataFim: null,
      status: "Em Andamento",
      progresso: 40,
      coordenador: "Camila Santos",
      beneficiarios: 15,
      orcamento: 45000,
      area: "Agricultura Familiar"
    },
    {
      id: "3",
      nome: "Capacitação em Agroecologia",
      descricao: "Programa de capacitação em práticas agroecológicas para pequenos produtores",
      dataInicio: "2023-01-20",
      dataFim: "2023-06-20",
      status: "Concluído",
      progresso: 100,
      coordenador: "André Lima",
      beneficiarios: 40,
      orcamento: 60000,
      area: "Capacitação"
    },
    {
      id: "4",
      nome: "Mecanização Rural",
      descricao: "Aquisição de equipamentos agrícolas para uso compartilhado",
      dataInicio: "2023-05-05",
      dataFim: null,
      status: "Planejamento",
      progresso: 10,
      coordenador: "Rafael Gomes",
      beneficiarios: 35,
      orcamento: 180000,
      area: "Infraestrutura"
    },
    {
      id: "5",
      nome: "Feira do Produtor",
      descricao: "Organização de feira semanal para venda direta de produtos da agricultura familiar",
      dataInicio: "2023-04-12",
      dataFim: null,
      status: "Em Andamento",
      progresso: 75,
      coordenador: "Juliana Costa",
      beneficiarios: 50,
      orcamento: 30000,
      area: "Comercialização"
    }
  ]);

  return { projetos };
}
