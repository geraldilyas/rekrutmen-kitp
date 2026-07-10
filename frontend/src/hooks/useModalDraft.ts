import { useEffect } from "react";

const DRAFT_PREFIX = "draft:";

export function draftKey(formName: string, id?: string | number | null): string {
  return `${DRAFT_PREFIX}${formName}:${id ?? "new"}`;
}

export function saveDraft<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage unavailable/full — draft persistence is best-effort only
  }
}

export function loadDraft<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  sessionStorage.removeItem(key);
}

// Clears every persisted form draft. Called on logout, per product requirement
// that drafts only survive an accidental close, not a session end.
export function clearAllDrafts(): void {
  const keys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k && k.startsWith(DRAFT_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => sessionStorage.removeItem(k));
}

// Keeps `data` mirrored into sessionStorage under `key` while `enabled` (the
// modal is open), so a half-filled form survives an accidental close (X /
// backdrop click) or page refresh. Explicit clearing (Cancel button, logout)
// is the caller's responsibility via clearDraft()/clearAllDrafts().
export function useDraftPersist<T>(key: string, data: T, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    saveDraft(key, data);
  }, [data, enabled, key]);
}
