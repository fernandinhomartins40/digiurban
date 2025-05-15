
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function FornecedoresPage() {
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando fornecedores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está em desenvolvimento. Em breve você poderá gerenciar todos os fornecedores da prefeitura por aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
