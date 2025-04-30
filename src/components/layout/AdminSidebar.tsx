
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
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
  MessageSquare,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path?: string;
  children?: {
    title: string;
    path: string;
  }[];
  moduleId?: string;
}

const SidebarItem = ({ icon, title, path, children, moduleId }: SidebarItemProps) => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = path ? location.pathname === path : children?.some(child => location.pathname === child.path);
  const hasChildren = children && children.length > 0;

  // Check if user has permission to see this module
  if (moduleId && !hasPermission(moduleId, "read")) {
    return null;
  }

  return (
    <div className="w-full">
      {hasChildren ? (
        <div className="w-full">
          <button
            className={cn(
              "flex items-center w-full px-4 py-2 text-sm rounded-md",
              isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="mr-2">{icon}</span>
            <span className="flex-1 text-left">{title}</span>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isOpen && (
            <div className="pl-6 mt-1 space-y-1">
              {children.map((child, index) => (
                <Link
                  key={index}
                  to={child.path}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-sm rounded-md",
                    location.pathname === child.path
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="flex-1">{child.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          to={path || "#"}
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm rounded-md",
            isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <span className="mr-2">{icon}</span>
          <span className="flex-1">{title}</span>
        </Link>
      )}
    </div>
  );
};

export function AdminSidebar() {
  const { logout, user } = useAuth();

  const sidebarItems: SidebarItemProps[] = [
    {
      icon: <Home size={18} />,
      title: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <Mail size={18} />,
      title: "Correio Interno",
      moduleId: "correio",
      children: [
        {
          title: "Dashboard",
          path: "/admin/correio/dashboard",
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
    // And so on for the remaining modules...
  ];

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r">
      <div className="flex items-center justify-center p-4 border-b">
        <h1 className="text-xl font-bold text-primary">digiurban</h1>
      </div>
      
      <div className="px-2 py-4 space-y-1 overflow-y-auto flex-grow">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
            <p className="text-xs text-gray-500">{user?.role === "prefeito" ? "Prefeito" : "Administrador"}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => logout()}
        >
          <LogOut size={16} />
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  );
}
