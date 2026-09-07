export const READONLY_DEMO_EMAIL = "ciiti-test@uai.edu.ar";

export const isReadonlyDemoEmail = (email: string | null | undefined): boolean =>
  Boolean(email && email.trim().toLowerCase() === READONLY_DEMO_EMAIL);

export const resolveReadonly = (
  email: string | null | undefined,
  claimsReadonly: boolean
): boolean => isReadonlyDemoEmail(email) || claimsReadonly;

export const resolveCanWrite = (
  email: string | null | undefined,
  claimsReadonly: boolean
): boolean => !resolveReadonly(email, claimsReadonly);
