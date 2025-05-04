
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Program, ProgramStatus } from "@/types/mayorOffice";
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
  User,
  Users,
  Clock,
  CheckCircle,
  BarChart,
} from "lucide-react";

interface ProgramDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export function ProgramDrawer({
  isOpen,
  onClose,
  program,
}: ProgramDrawerProps) {
  if (!program) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return "Não definida";
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  const getStatusBadge = (status: ProgramStatus) => {
    switch (status) {
      case "planning":
        return <Badge variant="outline">Planejamento</Badge>;
      case "in_progress":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
      case "completed":
        return <Badge variant="secondary">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
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
              Detalhes do Programa
            </DrawerTitle>
            <DrawerDescription>
              {program.code && `Código: ${program.code}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{program.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(program.status)}
                {program.category && <Badge variant="outline">{program.category}</Badge>}
              </div>
            </div>

            <Separator />

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm">{program.progress || 0}%</span>
              </div>
              <Progress 
                value={program.progress || 0}
                className={`h-2 ${getProgressColor(program.progress || 0)}`}
              />
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Atualizado em {formatDate(program.updatedAt)}
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
                <span className="text-sm">{formatDate(program.startDate)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data Fim</span>
                </div>
                <span className="text-sm">{formatDate(program.endDate)}</span>
              </div>
            </div>

            <Separator />

            {/* Budget & Responsible */}
            <div className="space-y-2">
              {program.budget !== undefined && (
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Orçamento:</strong> R$ {program.budget.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
              {program.responsible && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Responsável:</strong> {program.responsible}
                  </span>
                </div>
              )}
              {program.beneficiaries_count !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Beneficiários:</strong> {program.beneficiaries_count.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {program.description && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Descrição</h4>
                  <div className="text-sm border rounded-md p-3 bg-muted/30">
                    <div className="flex gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p>{program.description}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Milestones */}
            {program.milestones && program.milestones.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Marcos Principais</h4>
                  <ul className="space-y-2">
                    {program.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-green-500' : 'text-muted-foreground'} mt-0.5`} />
                        <span className="text-sm">
                          {milestone.title}
                          {milestone.date && <span className="text-xs text-muted-foreground block">
                            {formatDate(milestone.date)}
                          </span>}
                        </span>
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
