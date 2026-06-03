"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type SetValue<T> = T | ((value: T) => T);

const LOCAL_STORAGE_EVENT = "taskflow-local-storage";

function readLocalStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return initialValue;
    }

    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}"`, error);
    return initialValue;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_STORAGE_EVENT, callback);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(() => {
    return JSON.stringify(readLocalStorageValue(key, initialValue));
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(initialValue);
  }, [initialValue]);

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const value = useMemo(() => JSON.parse(snapshot) as T, [snapshot]);

  const updateValue = useCallback(
    (nextValue: SetValue<T>) => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        const currentValue = readLocalStorageValue(key, initialValue);
        const valueToStore =
          nextValue instanceof Function ? nextValue(currentValue) : nextValue;

        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
      } catch (error) {
        console.error(`Failed to write localStorage key "${key}"`, error);
      }
    },
    [key, initialValue],
  );

  return [value, updateValue, true] as const;
}
