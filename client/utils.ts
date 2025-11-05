import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values - converts TON to MGB (multiply by 10,000,000)
 * Examples: 0.00033 → "3,300 MGB", 0.0002 → "2,000 MGB"
 */
export function formatCurrency(value: string | number, includeSymbol: boolean = true): string {
  const numValue = parseFloat(typeof value === 'string' ? value : value.toString());
  
  if (isNaN(numValue)) {
    return includeSymbol ? '0 MGB' : '0';
  }
  
  // Convert TON to MGB (multiply by 10,000,000)
  const mgbValue = Math.round(numValue * 10000000);
  
  const symbol = includeSymbol ? ' MGB' : '';
  return `${mgbValue.toLocaleString()}${symbol}`;
}
