import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidades para fechas
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isDateInPast(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate <= today;
}

// Funciones para calcular fechas de vencimiento
export function addDaysToDate(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
}

export function subtractDaysFromDate(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() - days);
  return formatDateForInput(date);
}

export function calculateExpirationDate(creationDate: string, paymentPeriod: string): string {
  const date = new Date(creationDate);
  
  switch (paymentPeriod) {
    case '1 year':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case '2 years':
      date.setFullYear(date.getFullYear() + 2);
      break;
    case '3 years':
      date.setFullYear(date.getFullYear() + 3);
      break;
    default:
      // Si no coincide con los valores esperados, asumir 1 año
      date.setFullYear(date.getFullYear() + 1);
  }
  
  return formatDateForInput(date);
}

export function calculateHostingExpirationDate(registrationDate: string, paymentType: string): string {
  const date = new Date(registrationDate);
  
  switch (paymentType) {
    case 'Monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'Annual':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'Biennial':
      date.setFullYear(date.getFullYear() + 2);
      break;
    default:
      // Si no coincide, asumir mensual
      date.setMonth(date.getMonth() + 1);
  }
  
  return formatDateForInput(date);
} 