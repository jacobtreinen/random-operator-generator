import { useState, useEffect } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  // Initialize state from sessionStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading sessionStorage key:', key, error);
      return initialValue;
    }
  });

  // When storedValue changes, update sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error setting sessionStorage key:', key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
