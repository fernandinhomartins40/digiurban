
import { useState } from "react";

export interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  propriedade: string;
  area: number;
  situacao: string;
  municipio: string;
  culturas: string[];
  telefone: string;
  email: string;
}

export function useDemo() {
  const [produtores] = useState<Produtor[]>([
    {
      id: "1",
      nome: "João da Silva",
      cpf: "123.456.789-00",
      propriedade: "Sítio Boa Esperança",
      area: 12.5,
      situacao: "Ativo",
      municipio: "São José",
      culturas: ["Milho", "Feijão"],
      telefone: "(11) 98765-4321",
      email: "joao.silva@email.com"
    },
    {
      id: "2",
      nome: "Maria Oliveira",
      cpf: "987.654.321-00",
      propriedade: "Fazenda São Pedro",
      area: 85.0,
      situacao: "Ativo",
      municipio: "São José",
      culturas: ["Café", "Laranja"],
      telefone: "(11) 91234-5678",
      email: "maria.oliveira@email.com"
    },
    {
      id: "3",
      nome: "Carlos Pereira",
      cpf: "456.789.123-00",
      propriedade: "Chácara Bela Vista",
      area: 7.2,
      situacao: "Inativo",
      municipio: "São José",
      culturas: ["Mandioca", "Hortaliças"],
      telefone: "(11) 92468-1357",
      email: "carlos.pereira@email.com"
    },
    {
      id: "4",
      nome: "Ana Santos",
      cpf: "654.321.987-00",
      propriedade: "Sítio Recanto",
      area: 18.5,
      situacao: "Ativo",
      municipio: "São José",
      culturas: ["Tomate", "Pimentão", "Alface"],
      telefone: "(11) 95678-1234",
      email: "ana.santos@email.com"
    },
    {
      id: "5",
      nome: "Roberto Costa",
      cpf: "789.123.456-00",
      propriedade: "Fazenda Três Rios",
      area: 120.0,
      situacao: "Ativo",
      municipio: "São José",
      culturas: ["Soja", "Milho", "Trigo"],
      telefone: "(11) 93456-7890",
      email: "roberto.costa@email.com"
    }
  ]);

  return { produtores };
}
