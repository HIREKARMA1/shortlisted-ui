export const CONTACT_MESSAGE_MIN = 10;
export const CONTACT_MESSAGE_MAX = 5000;
export const CONTACT_PHONE_LENGTH = 10;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

export type ContactField = 'name' | 'email' | 'phone' | 'message';

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, CONTACT_PHONE_LENGTH);
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return /^\d{10}$/.test(value);
}

export function isValidMessage(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= CONTACT_MESSAGE_MIN && trimmed.length <= CONTACT_MESSAGE_MAX;
}

export function isValidName(value: string): boolean {
  return value.trim().length > 0;
}
