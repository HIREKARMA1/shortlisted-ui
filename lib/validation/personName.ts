const PERSON_NAME_INVALID_DEFAULT = 'Name can contain only letters and spaces.';

/** Letters (Latin + extended Latin + Devanagari + Odia) — ES5-safe, no \\p{L}. */
const PERSON_NAME_LETTER = /[A-Za-z\u00C0-\u024F\u0900-\u097F\u0B00-\u0B7F]/;

export function normalizePersonName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function isValidPersonName(value: string): boolean {
  const normalized = normalizePersonName(value);
  if (normalized.length < 2) return false;
  for (const char of normalized) {
    if (char === ' ') continue;
    if (!PERSON_NAME_LETTER.test(char)) return false;
  }
  return true;
}

export function getPersonNameError(
  value: string,
  options?: { required?: boolean; invalidMessage?: string }
): string | undefined {
  const trimmed = value.trim();
  const invalidMessage = options?.invalidMessage ?? PERSON_NAME_INVALID_DEFAULT;

  if (!trimmed) {
    return options?.required ? 'This field is required.' : undefined;
  }
  if (!isValidPersonName(value)) {
    return invalidMessage;
  }
  return undefined;
}
