
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { VulnerableFamily, FamilyMember } from "@/types/assistance";
import { getFamilyMembers } from "@/services/assistance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MembersDialogProps {
  open: boolean;
  onClose: () => void;
  family: VulnerableFamily;
}

export function MembersDialog({ open, onClose, family }: MembersDialogProps) {
  const { toast } = useToast();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    isDependent: false
  });

  useEffect(() => {
    if (open && family?.id) {
      loadMembers();
    }
  }, [open, family?.id]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getFamilyMembers(family.id);
      setMembers(data || []);
    } catch (error) {
      console.error("Error loading family members:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os membros da família",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    // In a real implementation, this would call an API to add the member
    // For now, we'll just show a toast message
    toast({
      title: "Não implementado",
      description: "A funcionalidade de adicionar membros ainda será implementada.",
    });
    setShowAddForm(false);
  };

  const handleDeleteMember = (memberId: string) => {
    // In a real implementation, this would call an API to delete the member
    toast({
      title: "Não implementado",
      description: "A funcionalidade de excluir membros ainda será implementada.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Membros da Família {family?.family_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Membros Cadastrados</h3>
                <Button onClick={() => setShowAddForm(true)} size="sm">
                  <UserPlus className="mr-2 h-4 w-4" /> Adicionar Membro
                </Button>
              </div>

              {members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum membro cadastrado para esta família.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Parentesco</TableHead>
                      <TableHead>Dependente</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.id}</TableCell>
                        <TableCell>{member.relationship}</TableCell>
                        <TableCell>{member.is_dependent ? "Sim" : "Não"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {showAddForm && (
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-4">Adicionar Novo Membro</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="member-name">Nome Completo</Label>
                        <Input 
                          id="member-name" 
                          value={newMember.name}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="relationship">Parentesco</Label>
                        <Select 
                          onValueChange={(value) => setNewMember({...newMember, relationship: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o parentesco" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pai">Pai</SelectItem>
                            <SelectItem value="mãe">Mãe</SelectItem>
                            <SelectItem value="filho(a)">Filho(a)</SelectItem>
                            <SelectItem value="avô/avó">Avô/Avó</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is-dependent"
                          checked={newMember.isDependent}
                          onChange={(e) => setNewMember({...newMember, isDependent: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="is-dependent">É dependente</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddMember}>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
