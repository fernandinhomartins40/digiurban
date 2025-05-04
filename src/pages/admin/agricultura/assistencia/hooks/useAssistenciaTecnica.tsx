
import { useState } from "react";

export interface Atendimento {
  id: string;
  protocolo: string;
  produtor: string;
  tecnico: string;
  data: string;
  tipo: string;
  status: string;
  observacoes: string;
  propriedade: string;
}

export function useAssistenciaTecnica() {
  const [atendimentos] = useState<Atendimento[]>([
    {
      id: "1",
      protocolo: "AT-2023-001",
      produtor: "João da Silva",
      tecnico: "Marcos Oliveira",
      data: "2023-06-10",
      tipo: "Análise de Solo",
      status: "Concluído",
      observacoes: "Análise realizada com sucesso. Recomendação de calagem enviada.",
      propriedade: "Sítio Boa Esperança"
    },
    {
      id: "2",
      protocolo: "AT-2023-002",
      produtor: "Maria Oliveira",
      tecnico: "Camila Santos",
      data: "2023-06-15",
      tipo: "Controle de Pragas",
      status: "Em Andamento",
      observacoes: "Identificação de pragas na plantação de café. Tratamento iniciado.",
      propriedade: "Fazenda São Pedro"
    },
    {
      id: "3",
      protocolo: "AT-2023-003",
      produtor: "Carlos Pereira",
      tecnico: "André Lima",
      data: "2023-06-20",
      tipo: "Irrigação",
      status: "Agendado",
      observacoes: "Avaliação do sistema de irrigação para horta orgânica.",
      propriedade: "Chácara Bela Vista"
    },
    {
      id: "4",
      protocolo: "AT-2023-004",
      produtor: "Ana Santos",
      tecnico: "Marcos Oliveira",
      data: "2023-06-22",
      tipo: "Análise de Solo",
      status: "Concluído",
      observacoes: "Coleta realizada. Amostra enviada ao laboratório.",
      propriedade: "Sítio Recanto"
    },
    {
      id: "5",
      protocolo: "AT-2023-005",
      produtor: "Roberto Costa",
      tecnico: "Camila Santos",
      data: "2023-06-25",
      tipo: "Manejo de Culturas",
      status: "Cancelado",
      observacoes: "Visita cancelada devido a condições climáticas.",
      propriedade: "Fazenda Três Rios"
    },
    {
      id: "6",
      protocolo: "AT-2023-006",
      produtor: "João da Silva",
      tecnico: "André Lima",
      data: "2023-06-28",
      tipo: "Mecanização",
      status: "Agendado",
      observacoes: "Orientação sobre uso de maquinário agrícola.",
      propriedade: "Sítio Boa Esperança"
    }
  ]);

  return { atendimentos };
}
