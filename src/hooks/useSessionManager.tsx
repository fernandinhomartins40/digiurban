
import { useEffect, useState } from 'react';
import { sessionManager, MAX_IDLE_TIME } from '@/lib/security/sessionManager';

interface SessionInfo {
  timeRemaining: number;
  percentRemaining: number;
  isActive: boolean;
}

/**
 * Hook to use the session manager in components
 */
export function useSessionManager() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    timeRemaining: MAX_IDLE_TIME,
    percentRemaining: 100,
    isActive: true
  });
  
  useEffect(() => {
    // Initialize session manager on component mount
    sessionManager.init();
    
    // Set up interval to update the time remaining
    const intervalId = setInterval(() => {
      const timeRemaining = sessionManager.getTimeRemaining();
      setSessionInfo({
        timeRemaining,
        percentRemaining: Math.floor((timeRemaining / MAX_IDLE_TIME) * 100),
        isActive: timeRemaining > 0
      });
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return {
    ...sessionInfo,
    refreshSession: async () => {
      const success = await sessionManager.manualRefresh();
      if (success) {
        setSessionInfo({
          timeRemaining: MAX_IDLE_TIME,
          percentRemaining: 100,
          isActive: true
        });
      }
      return success;
    }
  };
}

/**
 * Format session time remaining for display
 */
export function formatSessionTime(ms: number): string {
  if (ms <= 0) return '00:00';
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
