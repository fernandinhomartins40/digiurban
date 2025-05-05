
import { format, Locale } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Safely formats a date string or Date object with a given format
 * @param date The date to format (string or Date)
 * @param formatStr The format string (default: dd/MM/yyyy)
 * @param options Additional options
 * @returns Formatted date string or fallback text if invalid
 */
export const formatDate = (
  date: string | Date | undefined,
  formatStr: string = "dd/MM/yyyy",
  options: { locale?: Locale; fallback?: string } = {}
): string => {
  const { locale = ptBR, fallback = "Data inválida" } = options;
  
  if (!date) return fallback;
  
  try {
    // Convert to Date object if it's a string
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return fallback;
    }
    
    return format(dateObj, formatStr, { locale });
  } catch (e) {
    console.error("Error formatting date:", e);
    return fallback;
  }
};

/**
 * Safely converts a string or Date to a Date object
 * Returns undefined if the input is invalid
 */
export const toDate = (date: string | Date | undefined): Date | undefined => {
  if (!date) return undefined;
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return isNaN(dateObj.getTime()) ? undefined : dateObj;
  } catch (e) {
    return undefined;
  }
};
