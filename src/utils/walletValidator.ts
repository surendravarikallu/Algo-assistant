export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateAlgorandAddress(address: string): ValidationResult {
  if (!address) return { isValid: false, error: 'Address cannot be empty' };
  if (address.length !== 58) {
    return { isValid: false, error: 'Algorand address must be exactly 58 characters long' };
  }
  const clean = address.toUpperCase();
  const validChars = /^[A-Z2-7]+$/;
  if (!validChars.test(clean)) {
    return { isValid: false, error: 'Address contains invalid base32 characters' };
  }
  return { isValid: true };
}
