"use client";

import { useEffect, useState } from "react";

type SetValue<T> = T | ((value: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);

      if (storedValue) {
        setValue(JSON.parse(storedValue) as T);
      }
    } catch (error) {
      console.error(`Failed to read localStorage key "${key}"`, error);
    } finally {
      setIsInitialized(true);
    }
  }, [key]);

  const updateValue = (nextValue: SetValue<T>) => {
    try {
      setValue((currentValue) => {
        const valueToStore =
          nextValue instanceof Function ? nextValue(currentValue) : nextValue;

        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        return valueToStore;
      });
    } catch (error) {
      console.error(`Failed to write localStorage key "${key}"`, error);
    }
  };

  return [value, updateValue, isInitialized] as const;
}
