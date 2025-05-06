
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Realtime database operations
 */
export enum DatabaseOperation {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ALL = '*'
}

/**
 * Subscription options for realtime
 */
export interface SubscriptionOptions {
  event?: DatabaseOperation;
  schema?: string;
  filter?: string;
  filterCallback?: (payload: RealtimePostgresChangesPayload<any>) => boolean;
}

type RealtimeCallback = (payload: RealtimePostgresChangesPayload<any>) => void;

/**
 * Helper class to manage Supabase Realtime subscriptions
 */
class RealtimeClient {
  private channels: Map<string, RealtimeChannel> = new Map();
  
  /**
   * Create a channel ID based on table and options
   */
  private createChannelId(table: string, options: SubscriptionOptions = {}): string {
    const { event = '*', schema = 'public', filter = '' } = options;
    return `${schema}:${table}:${event}:${filter}`;
  }
  
  /**
   * Subscribe to table changes
   */
  subscribe(
    table: string,
    callback: RealtimeCallback,
    options: SubscriptionOptions = {}
  ): () => void {
    const { event = DatabaseOperation.ALL, schema = 'public', filter = '', filterCallback } = options;
    const channelId = this.createChannelId(table, options);
    
    // Check if we already have this channel
    if (this.channels.has(channelId)) {
      console.warn(`Channel ${channelId} already exists. Reusing existing channel.`);
      return () => this.unsubscribe(channelId);
    }
    
    // Create a new channel
    const channel = supabase.channel(channelId);
    
    // Configure the channel for postgres changes
    // Fix: The correct typing for postgres_changes event
    channel.on(
      'postgres_changes' as any,  // Use type assertion as any to bypass TypeScript error
      {
        event: event as 'INSERT' | 'UPDATE' | 'DELETE' | '*',
        schema: schema,
        table: table,
        filter: filter || undefined
      },
      (payload) => {
        // Apply additional filtering if provided
        if (filterCallback && !filterCallback(payload as RealtimePostgresChangesPayload<any>)) {
          return;
        }
        
        // Execute the callback
        callback(payload as RealtimePostgresChangesPayload<any>);
      }
    ).subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.warn(`Realtime subscription to ${channelId} status: ${status}`);
      } else {
        console.log(`Successfully subscribed to ${channelId}`);
      }
    });
    
    // Store the channel for later reference
    this.channels.set(channelId, channel);
    
    // Return unsubscribe function
    return () => this.unsubscribe(channelId);
  }
  
  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channelId: string): void {
    const channel = this.channels.get(channelId);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelId);
      console.log(`Unsubscribed from ${channelId}`);
    }
  }
  
  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach((channel, id) => {
      supabase.removeChannel(channel);
      console.log(`Unsubscribed from ${id}`);
    });
    
    this.channels.clear();
  }
  
  /**
   * Enable realtime for a table
   * Note: This requires appropriate permissions
   */
  async enableRealtimeForTable(table: string): Promise<boolean> {
    try {
      // For now, we'll just log this since the RPC may not exist yet
      console.log(`Enabling realtime for ${table} is not currently supported.`);
      return true;
    } catch (error) {
      console.error(`Failed to enable realtime for ${table}:`, error);
      return false;
    }
  }
}

// Export a singleton instance
export const realtime = new RealtimeClient();
