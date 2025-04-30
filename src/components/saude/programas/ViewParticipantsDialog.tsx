
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HealthProgram, ProgramParticipant } from "@/types/health";
import { getProgramParticipants } from "@/services/health/programs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ViewParticipantsDialogProps {
  program: HealthProgram | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewParticipantsDialog({
  program,
  open,
  onOpenChange,
}: ViewParticipantsDialogProps) {
  const [participants, setParticipants] = useState<ProgramParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchParticipants() {
      if (program && open) {
        setIsLoading(true);
        try {
          const { data } = await getProgramParticipants(program.id);
          setParticipants(data);
        } catch (error) {
          console.error("Error fetching program participants:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchParticipants();
  }, [program, open]);

  if (!program) {
    return null;
  }

  const filteredParticipants = participants.filter((participant) =>
    participant.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Participantes - {program.name}</DialogTitle>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Carregando participantes...</p>
          </div>
        ) : filteredParticipants.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.patientName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(participant.joinDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={participant.isActive ? "default" : "secondary"}
                      >
                        {participant.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {participant.notes ? (
                        <span className="line-clamp-1">{participant.notes}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Sem observações
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>
              {searchQuery
                ? "Nenhum participante encontrado com esse nome."
                : "Nenhum participante registrado neste programa."}
            </p>
            <Button variant="outline" className="mt-4">
              Adicionar Participante
            </Button>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <p className="text-sm text-muted-foreground pt-2">
            Total: {filteredParticipants.length} participante(s)
          </p>
          {participants.length > 0 && (
            <Button>Adicionar Participante</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
