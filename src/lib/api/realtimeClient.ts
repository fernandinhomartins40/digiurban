
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Enum for the types of database operations we can subscribe to
export enum DatabaseOperation {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ALL = '*'
}

// Type for our subscription callbacks
export type SubscriptionCallback<T = any> = (
  payload: RealtimePostgresChangesPayload<T>
) => void;

// Interface for our subscription options
export interface SubscriptionOptions {
  schema?: string;
  filter?: string;
  event?: DatabaseOperation;
}

// Class to manage realtime subscriptions
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscriptions: Map<string, Set<SubscriptionCallback>> = new Map();
  
  constructor() {
    // Setup any global handlers if needed
    window.addEventListener('beforeunload', () => this.cleanupAll());
  }
  
  // Subscribe to changes on a table
  subscribe<T = any>(
    table: string,
    callback: SubscriptionCallback<T>,
    options: SubscriptionOptions = {}
  ): () => void {
    const {
      schema = 'public',
      event = DatabaseOperation.ALL,
      filter
    } = options;
    
    // Create a unique key for this subscription
    const subscriptionKey = `${schema}:${table}:${event}${filter ? `:${filter}` : ''}`;
    
    // Create a new channel if one doesn't exist
    if (!this.channels.has(subscriptionKey)) {
      const channel = supabase
        .channel(`changes:${subscriptionKey}`)
        .on(
          'postgres_changes',
          {
            event: event === DatabaseOperation.ALL ? '*' : event,
            schema,
            table,
            filter
          },
          (payload) => {
            // Call all callbacks registered for this subscription
            const callbacks = this.subscriptions.get(subscriptionKey);
            if (callbacks) {
              callbacks.forEach(cb => cb(payload));
            }
          }
        )
        .subscribe();
      
      this.channels.set(subscriptionKey, channel);
      this.subscriptions.set(subscriptionKey, new Set());
    }
    
    // Add this callback to the set of callbacks
    const callbacks = this.subscriptions.get(subscriptionKey)!;
    callbacks.add(callback);
    
    // Return an unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(subscriptionKey);
      if (callbacks) {
        callbacks.delete(callback);
        
        // If there are no more callbacks, remove the channel
        if (callbacks.size === 0) {
          const channel = this.channels.get(subscriptionKey);
          if (channel) {
            supabase.removeChannel(channel);
            this.channels.delete(subscriptionKey);
            this.subscriptions.delete(subscriptionKey);
          }
        }
      }
    };
  }
  
  // Get the number of active subscriptions
  get subscriptionCount(): number {
    return this.channels.size;
  }
  
  // Cleanup all subscriptions
  cleanupAll(): void {
    for (const channel of this.channels.values()) {
      supabase.removeChannel(channel);
    }
    
    this.channels.clear();
    this.subscriptions.clear();
  }
}

// Singleton instance of our realtime manager
export const realtime = new RealtimeManager();

// Helper hook for using realtime
export function enableRealtimeTables(tables: string[]): Promise<void> {
  // Enable realtime for the specified tables
  const promises = tables.map(table => 
    supabase.rpc('enable_realtime', { table_name: table })
  );
  
  return Promise.all(promises).then(() => {
    console.log(`Realtime enabled for tables: ${tables.join(', ')}`);
  });
}
