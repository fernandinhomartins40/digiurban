
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GabineteIndexPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Gabinete do Prefeito</title>
      </Helmet>
      
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gabinete do Prefeito</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as atividades do gabinete
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Painel de Controle do Gabinete</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bem-vindo ao dashboard do Gabinete do Prefeito. Selecione uma opção no menu lateral para continuar.</p>
        </CardContent>
      </Card>
    </div>
  );
}
