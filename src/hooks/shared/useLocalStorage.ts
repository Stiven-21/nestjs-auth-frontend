"use client";
import { useEffect, useState } from "react";

type setValue<T> = T | ((value: T) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: setValue<T>) => void] {
  const [storeValue, setStoreValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore =
        typeof storeValue === "function" ? storeValue(storeValue) : storeValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  }, [key, storeValue]);

  return [storeValue, setStoreValue];
}

export default useLocalStorage;
