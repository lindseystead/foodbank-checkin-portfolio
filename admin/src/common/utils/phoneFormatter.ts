/**
 * Phone number formatting utilities
 */

/**
 * Format a phone number to a readable format
 * @param phoneNumber - Raw phone number string
 * @returns Formatted phone number or original if invalid
 */
export const formatPhoneNumber = (phoneNumber: string | undefined | null): string => {
  if (!phoneNumber) return 'N/A';
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Handle different phone number lengths
  if (digits.length === 10) {
    // US/Canada format: (XXX) XXX-XXXX
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US/Canada with country code: 1 (XXX) XXX-XXXX
    return `1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 7) {
    // Local format: XXX-XXXX
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  
  // Return original if we can't format it
  return phoneNumber;
};

/**
 * Format a phone number for display in tables (shorter format)
 * @param phoneNumber - Raw phone number string
 * @returns Formatted phone number or original if invalid
 */
export const formatPhoneNumberShort = (phoneNumber: string | undefined | null): string => {
  if (!phoneNumber) return 'N/A';
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Handle different phone number lengths
  if (digits.length === 10) {
    // US/Canada format: XXX-XXX-XXXX
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US/Canada with country code: 1-XXX-XXX-XXXX
    return `1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 7) {
    // Local format: XXX-XXXX
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  
  // Return original if we can't format it
  return phoneNumber;
};
