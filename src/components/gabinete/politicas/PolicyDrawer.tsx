
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Policy, PolicyStatus } from "@/types/mayorOffice";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  FileText,
  BarChart,
  CheckCircle,
  Clock,
  User
} from "lucide-react";

interface PolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy | null;
}

export function PolicyDrawer({
  isOpen,
  onClose,
  policy,
}: PolicyDrawerProps) {
  if (!policy) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return "Não definida";
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  const getStatusBadge = (status: PolicyStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativa</Badge>;
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "completed":
        return <Badge variant="secondary">Concluída</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-orange-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-semibold">
              Detalhes da Política
            </DrawerTitle>
            <DrawerDescription>
              {policy.code && `Código: ${policy.code}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{policy.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(policy.status)}
                <Badge variant="outline">{policy.category}</Badge>
              </div>
            </div>

            <Separator />

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm">{policy.progress || 0}%</span>
              </div>
              <Progress 
                value={policy.progress || 0}
                className={`h-2 ${getProgressColor(policy.progress || 0)}`}
              />
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Atualizado em {formatDate(policy.updated_at)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data de Início</span>
                </div>
                <span className="text-sm">{formatDate(policy.start_date)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data Fim</span>
                </div>
                <span className="text-sm">{formatDate(policy.end_date)}</span>
              </div>
            </div>

            <Separator />

            {/* Meta & Responsible */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Meta:</strong> {policy.target_goal}
                </span>
              </div>
              {policy.responsible && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Responsável:</strong> {policy.responsible}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {policy.description && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Descrição</h4>
                  <div className="text-sm border rounded-md p-3 bg-muted/30">
                    <div className="flex gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p>{policy.description}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Goals */}
            {policy.key_objectives && policy.key_objectives.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Objetivos Principais</h4>
                  <ul className="space-y-2">
                    {policy.key_objectives.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <DrawerFooter>
            <Button onClick={onClose}>Fechar</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
