
import React from 'react';
import { toast, ToastAction } from "@/hooks/use-toast";

/**
 * Displays a session timeout warning with refresh option
 */
export const showSessionTimeoutWarning = (handleRefresh: () => void) => {
  toast({
    title: 'Sessão expirando',
    description: 'Sua sessão irá expirar em breve. Deseja continuar conectado?',
    variant: 'default',
    action: (
      <ToastAction
        altText="Renovar Sessão"
        onClick={handleRefresh}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Renovar Sessão
      </ToastAction>
    )
  });
};

/**
 * Displays a session expired notification
 */
export const showSessionExpiredNotification = () => {
  toast({
    title: 'Sessão expirada',
    description: 'Sua sessão expirou por inatividade. Por favor, faça login novamente.',
    variant: 'default',
  });
};
