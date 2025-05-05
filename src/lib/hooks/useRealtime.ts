
import { useEffect, useState } from 'react';
import { realtime, DatabaseOperation, SubscriptionOptions } from '../api/realtimeClient';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

interface UseRealtimeOptions extends SubscriptionOptions {
  enabled?: boolean;
  onInsert?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<any>) => void;
  queryKeysToInvalidate?: string[];
}

export function useRealtime(
  table: string,
  options: UseRealtimeOptions = {}
) {
  const {
    enabled = true,
    onInsert,
    onUpdate,
    onDelete,
    queryKeysToInvalidate = [],
    ...subscriptionOptions
  } = options;
  
  const [lastEvent, setLastEvent] = useState<RealtimePostgresChangesPayload<any> | null>(null);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!enabled) return;
    
    // Helper to handle different event types
    const handleRealtimeEvent = (payload: RealtimePostgresChangesPayload<any>) => {
      setLastEvent(payload);
      
      // Call the specific handler for this event type
      if (payload.eventType === 'INSERT' && onInsert) {
        onInsert(payload);
      } else if (payload.eventType === 'UPDATE' && onUpdate) {
        onUpdate(payload);
      } else if (payload.eventType === 'DELETE' && onDelete) {
        onDelete(payload);
      }
      
      // Invalidate related queries if specified
      if (queryKeysToInvalidate.length > 0) {
        queryKeysToInvalidate.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    };
    
    // Subscribe to the table with our handler
    const unsubscribe = realtime.subscribe(
      table,
      handleRealtimeEvent,
      subscriptionOptions
    );
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [table, enabled, onInsert, onUpdate, onDelete, queryClient]);
  
  return {
    lastEvent,
    isEnabled: enabled,
  };
}

// Convenience hook for specific operations
export function useRealtimeInserts(
  table: string,
  onInsert: (payload: RealtimePostgresChangesPayload<any>) => void,
  options: Omit<UseRealtimeOptions, 'onInsert' | 'event'> = {}
) {
  return useRealtime(table, {
    ...options,
    event: DatabaseOperation.INSERT,
    onInsert,
  });
}

export function useRealtimeUpdates(
  table: string,
  onUpdate: (payload: RealtimePostgresChangesPayload<any>) => void,
  options: Omit<UseRealtimeOptions, 'onUpdate' | 'event'> = {}
) {
  return useRealtime(table, {
    ...options,
    event: DatabaseOperation.UPDATE,
    onUpdate,
  });
}

export function useRealtimeDeletes(
  table: string,
  onDelete: (payload: RealtimePostgresChangesPayload<any>) => void,
  options: Omit<UseRealtimeOptions, 'onDelete' | 'event'> = {}
) {
  return useRealtime(table, {
    ...options,
    event: DatabaseOperation.DELETE,
    onDelete,
  });
}
