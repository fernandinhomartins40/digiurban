
import React from "react";

interface AuthErrorHandlerProps {
  authError: string | null;
}

export function AuthErrorHandler({ authError }: AuthErrorHandlerProps) {
  if (!authError) return null;
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-red-50 text-red-800 p-4 rounded-md max-w-md mb-4">
        <h3 className="text-lg font-medium">Erro na autenticação</h3>
        <p>{authError}</p>
      </div>
      <button 
        className="px-4 py-2 bg-primary text-white rounded-md"
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
    </div>
  );
}

export function AuthLoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-2">Iniciando autenticação...</span>
    </div>
  );
}
