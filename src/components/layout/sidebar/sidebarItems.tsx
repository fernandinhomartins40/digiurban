
import React from "react";
import {
  Home,
  Mail,
  Users,
  FileText,
  DollarSign,
  Briefcase,
  BookOpen,
  Heart,
  Gift,
  Building,
  Wrench,
  Trash2,
  Leaf,
  Tractor,
  Trophy,
  Music,
  Map,
  HelpCircle,
  Shield,
  Bus,
  MessageCircle
} from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getSidebarItems = (unreadCount: number = 0): SidebarItemProps[] => [
  {
    icon: <Home size={18} />,
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <MessageCircle size={18} />,
    title: "Chat",
    path: "/admin/chat",
    badge: unreadCount,
  },
  {
    icon: <Mail size={18} />,
    title: "Correio Interno",
    moduleId: "correio",
    badge: unreadCount,
    children: [
      {
        title: "Dashboard",
        path: "/admin/correio/dashboard",
        badge: unreadCount,
      },
      {
        title: "Ofício Digital",
        path: "/admin/correio/oficio-digital",
      },
      {
        title: "Criador de Ofícios",
        path: "/admin/correio/criador-oficios",
      },
    ],
  },
  {
    icon: <Briefcase size={18} />,
    title: "Administração",
    moduleId: "administracao",
    children: [
      {
        title: "RH",
        path: "/admin/administracao/rh",
      },
      {
        title: "Solicitações Gerais",
        path: "/admin/administracao/solicitacoes",
      },
      {
        title: "Compras",
        path: "/admin/administracao/compras",
      },
    ],
  },
  {
    icon: <DollarSign size={18} />,
    title: "Finanças",
    moduleId: "financas",
    children: [
      {
        title: "Dashboard",
        path: "/admin/financas/dashboard",
      },
      {
        title: "Solicitação de Guias",
        path: "/admin/financas/guias",
      },
      {
        title: "Consultar Débitos",
        path: "/admin/financas/debitos",
      },
      {
        title: "Certidões",
        path: "/admin/financas/certidoes",
      },
    ],
  },
  {
    icon: <BookOpen size={18} />,
    title: "Educação",
    moduleId: "educacao",
    children: [
      {
        title: "Escolas e CMEIs",
        path: "/admin/educacao/escolas",
      },
      {
        title: "Matrícula Escolar",
        path: "/admin/educacao/matricula",
      },
      {
        title: "Transporte Escolar",
        path: "/admin/educacao/transporte",
      },
      {
        title: "Alunos e Professores",
        path: "/admin/educacao/pessoas",
      },
      {
        title: "Merenda Escolar",
        path: "/admin/educacao/merenda",
      },
      {
        title: "Ocorrências",
        path: "/admin/educacao/ocorrencias",
      },
    ],
  },
  {
    icon: <Heart size={18} />,
    title: "Saúde",
    moduleId: "saude",
    children: [
      {
        title: "Atendimentos",
        path: "/admin/saude/atendimentos",
      },
      {
        title: "Medicamentos",
        path: "/admin/saude/medicamentos",
      },
      {
        title: "Encaminhamentos TFD",
        path: "/admin/saude/tfd",
      },
      {
        title: "Programas de Saúde",
        path: "/admin/saude/programas",
      },
      {
        title: "Campanhas",
        path: "/admin/saude/campanhas",
      },
      {
        title: "ACS",
        path: "/admin/saude/acs",
      },
    ],
  },
  {
    icon: <Gift size={18} />,
    title: "Assistência Social",
    moduleId: "assistencia",
    children: [
      {
        title: "Benefícios",
        path: "/admin/assistencia/beneficios",
      },
      {
        title: "Programas Sociais",
        path: "/admin/assistencia/programas",
      },
      {
        title: "CRAS/CREAS",
        path: "/admin/assistencia/cras",
      },
      {
        title: "Famílias Vulneráveis",
        path: "/admin/assistencia/familias",
      },
    ],
  },
  {
    icon: <Building size={18} />,
    title: "Obras Públicas",
    moduleId: "obras",
    children: [
      {
        title: "Pequenas Obras",
        path: "/admin/obras/pequenas",
      },
      {
        title: "Mapa de Obras",
        path: "/admin/obras/mapa",
      },
      {
        title: "Feedback Cidadão",
        path: "/admin/obras/feedback",
      },
    ],
  },
  {
    icon: <Wrench size={18} />,
    title: "Serviços Públicos",
    moduleId: "servicos",
    children: [
      {
        title: "Solicitações",
        path: "/admin/servicos/solicitacoes",
      },
      {
        title: "Registro Fotográfico",
        path: "/admin/servicos/registros",
      },
    ],
  },
  {
    icon: <Leaf size={18} />,
    title: "Meio Ambiente",
    moduleId: "meioambiente",
    children: [
      {
        title: "Licenças",
        path: "/admin/meioambiente/licencas",
      },
      {
        title: "Denúncias",
        path: "/admin/meioambiente/denuncias",
      },
      {
        title: "Campanhas",
        path: "/admin/meioambiente/campanhas",
      },
    ],
  },
];
