
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

/**
 * Exports dashboard data to CSV format
 * @param data The data to export
 * @param filename The name of the file to be downloaded
 */
export async function exportToCSV(data: any[], filename: string): Promise<void> {
  if (!data || !data.length) {
    throw new Error('No data to export');
  }

  try {
    // Get all possible columns from the data
    const columns = Array.from(
      new Set(
        data.flatMap(item => Object.keys(item))
      )
    );

    // Create CSV header row
    let csvContent = columns.join(',') + '\n';

    // Add data rows
    data.forEach(item => {
      const row = columns.map(column => {
        const value = item[column];
        // Handle different data types and ensure proper CSV formatting
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        return value;
      }).join(',');
      csvContent += row + '\n';
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

/**
 * Captures a screenshot of a dashboard element and downloads it
 * @param elementId The ID of the HTML element to capture
 * @param filename The name of the file to be downloaded
 */
export async function captureScreenshot(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    const dataUrl = await toPng(element, { quality: 0.95 });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw error;
  }
}

/**
 * Generates a shareable URL for dashboard views
 * @param dashboardId The identifier of the dashboard
 * @param filters Optional filters to apply to the dashboard
 * @returns A shareable URL
 */
export function generateShareableURL(dashboardId: string, filters?: Record<string, any>): string {
  const baseUrl = window.location.origin;
  const path = `/dashboard/share/${dashboardId}`;
  
  if (!filters || Object.keys(filters).length === 0) {
    return `${baseUrl}${path}`;
  }
  
  // Convert filters to query parameters
  const queryParams = Object.entries(filters)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${baseUrl}${path}?${queryParams}`;
}
