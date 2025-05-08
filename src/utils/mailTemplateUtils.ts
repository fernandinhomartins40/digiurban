
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique field ID for template fields
 * @returns A string formatted as a valid field key
 */
export const generateFieldId = (): string => {
  // Generate a short ID based on UUID to ensure uniqueness
  const shortId = uuidv4().substring(0, 8);
  return `field_${shortId}`;
};

/**
 * Validates if a string is a valid field key format
 * Field keys should be lowercase with underscores and no spaces
 * @param key The field key to validate
 * @returns Boolean indicating if the key is valid
 */
export const isValidFieldKey = (key: string): boolean => {
  const regex = /^[a-z0-9_]+$/;
  return regex.test(key);
};

/**
 * Converts any string to a valid field key format
 * @param text The text to convert
 * @returns A valid field key
 */
export const textToFieldKey = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

/**
 * Extracts field placeholders from a string
 * @param content The content to analyze
 * @returns Array of field keys found in the content
 */
export const extractFieldsFromContent = (content: string): string[] => {
  const regex = /{{([^}]+)}}/g;
  const fields: string[] = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    fields.push(match[1]);
  }
  
  return [...new Set(fields)]; // Return unique fields only
};
