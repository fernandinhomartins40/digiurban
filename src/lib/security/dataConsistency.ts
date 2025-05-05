
/**
 * Utilities for ensuring data consistency and integrity
 */

/**
 * Interface for entities with version control
 */
export interface Versionable {
  version?: number;
}

/**
 * Options for optimistic locking
 */
export interface OptimisticLockOptions {
  onConflict?: (serverVersion: number, clientVersion: number) => void;
  retryOnConflict?: boolean;
  maxRetries?: number;
}

/**
 * Class to handle optimistic locking for concurrent edits
 */
export class OptimisticLock {
  /**
   * Check for version conflicts
   * @param clientData Client entity with version
   * @param serverData Server entity with version
   * @returns True if there's a conflict, false otherwise
   */
  static hasConflict<T extends Versionable>(clientData: T, serverData: T): boolean {
    // If versions are not defined, can't determine conflict
    if (clientData.version === undefined || serverData.version === undefined) {
      return false;
    }
    
    // Conflict exists if server version is newer than client version
    return serverData.version > clientData.version;
  }
  
  /**
   * Prepare entity for update by incrementing version
   * @param entity Entity to prepare for update
   * @returns Updated entity with incremented version
   */
  static prepareForUpdate<T extends Versionable>(entity: T): T {
    return {
      ...entity,
      version: (entity.version ?? 0) + 1
    };
  }
  
  /**
   * Handle optimistic update with version checking
   * @param updateFn Function that performs the update
   * @param getFreshDataFn Function to get fresh data from server
   * @param clientData Client data with version
   * @param options Optimistic lock options
   * @returns Result of the update
   */
  static async handleOptimisticUpdate<T extends Versionable, R>(
    updateFn: (data: T) => Promise<R>,
    getFreshDataFn: () => Promise<T>,
    clientData: T,
    options: OptimisticLockOptions = {}
  ): Promise<R> {
    const { 
      onConflict,
      retryOnConflict = false,
      maxRetries = 3
    } = options;
    
    let attempts = 0;
    let currentData = clientData;
    
    while (attempts <= maxRetries) {
      try {
        // Increment version before update
        const dataToUpdate = this.prepareForUpdate(currentData);
        
        // Perform update
        return await updateFn(dataToUpdate);
      } catch (error: any) {
        // Check if error is a version conflict
        if (error?.message?.includes('version conflict') || 
            error?.message?.includes('concurrent update')) {
          attempts++;
          
          // Get fresh data from server
          const serverData = await getFreshDataFn();
          
          // Call conflict handler if provided
          if (onConflict && serverData.version !== undefined && currentData.version !== undefined) {
            onConflict(serverData.version, currentData.version);
          }
          
          // If we should retry, update currentData and try again
          if (retryOnConflict && attempts <= maxRetries) {
            currentData = serverData;
            continue;
          }
          
          throw new Error('Version conflict detected. The data was modified by another user.');
        }
        
        // For other errors, just rethrow
        throw error;
      }
    }
    
    throw new Error(`Failed to update after ${maxRetries} attempts due to conflicts.`);
  }
}

/**
 * Utility to detect and handle duplicate form submissions
 */
export class DuplicateSubmissionPreventer {
  private static submissionTimestamps: Map<string, number> = new Map();
  private static MIN_INTERVAL_MS = 2000; // Minimum 2 seconds between submissions
  
  /**
   * Check if this is a duplicate submission
   * @param formId Unique identifier for the form
   * @returns True if this appears to be a duplicate submission
   */
  static isDuplicateSubmission(formId: string): boolean {
    const now = Date.now();
    const lastSubmission = this.submissionTimestamps.get(formId) || 0;
    
    // Check if enough time has passed since last submission
    if (now - lastSubmission < this.MIN_INTERVAL_MS) {
      return true;
    }
    
    // Update submission timestamp
    this.submissionTimestamps.set(formId, now);
    return false;
  }
  
  /**
   * Clear submission history for a form
   * @param formId Unique identifier for the form
   */
  static clearSubmissionHistory(formId: string): void {
    this.submissionTimestamps.delete(formId);
  }
  
  /**
   * Clear all submission history
   */
  static clearAllSubmissionHistory(): void {
    this.submissionTimestamps.clear();
  }
}

/**
 * Create a function that debounces rapid calls
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitMs: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, waitMs);
  };
}
