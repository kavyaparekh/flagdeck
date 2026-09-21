const STORAGE_KEY = "flagdeck:passcode";
export const PASSCODE_HEADER = "x-flagdeck-passcode";

export function getStoredPasscode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setStoredPasscode(value: string): void {
  sessionStorage.setItem(STORAGE_KEY, value);
}
