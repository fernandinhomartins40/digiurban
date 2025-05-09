
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { HRService } from "@/types/hr";

interface ServiceDetailProps {
  service: HRService;
  onBack: () => void;
  onEdit: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  onBack,
  onEdit,
}) => {
  // Format date to display in Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get field type display name
  const getFieldTypeName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      text: "Texto",
      textarea: "Área de Texto",
      number: "Número",
      date: "Data",
      checkbox: "Checkbox",
      select: "Seleção",
      file: "Arquivo",
    };
    return typeMap[type] || type;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <CardTitle className="text-2xl">{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge>{service.category}</Badge>
            {service.is_active ? (
              <Badge variant="default" className="bg-green-500">Ativo</Badge>
            ) : (
              <Badge variant="outline">Inativo</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Detalhes do Serviço</h3>
          <Separator className="my-2" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categoria</p>
              <p>{service.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center">
                {service.is_active ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Ativo</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span>Inativo</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Requer Aprovação</p>
              <div className="flex items-center">
                {service.requires_approval ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Sim</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span>Não</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Campos do Formulário</h3>
          <Separator className="my-2" />
          {service.form_schema?.fields && service.form_schema.fields.length > 0 ? (
            <div className="grid gap-2">
              {service.form_schema.fields.map((field, index) => (
                <div
                  key={`${field.name}-${index}`}
                  className="p-3 border rounded-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{field.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Nome: {field.name}
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline">{getFieldTypeName(field.type)}</Badge>
                      {field.required && (
                        <Badge variant="secondary" className="ml-2">
                          Obrigatório
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Nenhum campo definido para este serviço.
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium">Informações do Sistema</h3>
          <Separator className="my-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="font-mono">{service.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
              <p>{formatDate(service.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
              <p>{formatDate(service.updated_at)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Editar Serviço
        </Button>
      </CardFooter>
    </Card>
  );
};
