import { pdf } from '@react-pdf/renderer';
import type { ReactElement } from 'react';

/**
 * Generate PDF from React-PDF component and trigger download
 * @param component - React-PDF Document component
 * @param filename - Name of the downloaded PDF file
 */
export async function downloadPDF(
  component: ReactElement,
  filename: string
): Promise<void> {
  try {
    // Generate PDF blob
    const blob = await pdf(component as any).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal mengunduh PDF. Silakan coba lagi.');
  }
}

/**
 * Generate unique registration number with prefix
 * @param prefix - Prefix for registration number (e.g., 'NASDEM', 'PIP')
 * @returns Formatted registration number
 */
export function generateRegistrationNumber(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `${prefix}-${dateStr}-${random}`;
}

/**
 * Format date for PDF display
 * @param date - Date to format
 * @returns Formatted date string in Indonesian locale
 */
export function formatDateForPDF(date?: Date | string): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format datetime for PDF display
 * @param date - Date to format
 * @returns Formatted datetime string in Indonesian locale
 */
export function formatDateTimeForPDF(date?: Date | string): string {
  if (!date) return new Date().toLocaleString('id-ID');
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
