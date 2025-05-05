
import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useSessionManager, formatSessionTime } from '@/hooks/useSessionManager';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * Session timeout warning that appears when session is about to expire
 */
export function SessionTimeoutWarning() {
  const { timeRemaining, percentRemaining, refreshSession } = useSessionManager();
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Only show warning when less than 5 minutes remaining
  useEffect(() => {
    const fiveMinutes = 5 * 60 * 1000;
    
    if (timeRemaining < fiveMinutes && timeRemaining > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [timeRemaining]);
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSession();
    setIsRefreshing(false);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <Alert className="fixed bottom-4 right-4 w-80 border-amber-500 bg-amber-50 dark:bg-amber-950 shadow-lg">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-600 dark:text-amber-400">
        Sua sessão irá expirar em breve
      </AlertTitle>
      <AlertDescription className="text-muted-foreground">
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Tempo restante:</span>
            <span className="font-medium">{formatSessionTime(timeRemaining)}</span>
          </div>
          
          <Progress 
            value={percentRemaining} 
            className="h-1.5 bg-amber-100 dark:bg-amber-900 [&>div]:bg-amber-500" 
          />
          
          <Button 
            onClick={handleRefresh}
            className="w-full bg-amber-500 hover:bg-amber-600 mt-2"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Renovando...
              </>
            ) : (
              'Renovar Sessão'
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
