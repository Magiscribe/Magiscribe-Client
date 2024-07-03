import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWithLocalStorage = (initialState: any, itemName: string) => {
    const [form, setForm] = useState(() => {
      // Attempt to get the stored form data from local storage
      const storedFormData = localStorage.getItem(itemName);
      if (storedFormData) {
        return JSON.parse(storedFormData);
      }
      return initialState;
    });
  
    useEffect(() => {
      // Update local storage whenever the form state changes
      localStorage.setItem(itemName, JSON.stringify(form));
    }, [form]);
  
    return [form, setForm];
  };