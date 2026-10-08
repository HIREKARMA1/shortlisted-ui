export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_PHOTO_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export function validateProfilePhotoFile(file: File): string | undefined {
  const type = (file.type || '').toLowerCase();
  if (!PROFILE_PHOTO_ACCEPTED_TYPES.includes(type as (typeof PROFILE_PHOTO_ACCEPTED_TYPES)[number])) {
    return 'Please upload a valid image file.';
  }
  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    return 'Profile photo must be less than 5 MB.';
  }
  return undefined;
}
