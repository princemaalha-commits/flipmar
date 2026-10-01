import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initial: T,
  validate: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (validate(parsed)) return parsed;
      }
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    return initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Keep in-memory behavior when storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
