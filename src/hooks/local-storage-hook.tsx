import { useEffect, useState } from 'react';

export const useWithLocalStorage = <T,>(
  initialState: T,
  itemName: string,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [form, setForm] = useState<T>(() => {
    // Attempt to get the stored form data from local storage
    const storedFormData = localStorage.getItem(itemName);
    if (storedFormData) {
      return JSON.parse(storedFormData) as T;
    }
    return initialState;
  });

  useEffect(() => {
    // Update local storage whenever the form state changes
    localStorage.setItem(itemName, JSON.stringify(form));
  }, [form, itemName]);

  return [form, setForm];
};
