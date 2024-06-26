import { createContext, useContext, useEffect, useState } from 'react';

interface TitleContextProps {
  title: string;
  setTitle: (title: string) => void;
}

export const TitleContext = createContext<TitleContextProps | undefined>(undefined);

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTitle must be used within an AlertProvider');
  }
  return context;
};

export const useSetTitle = () => useTitle().setTitle;

export const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    document.title = title ? `Magiscribe | ${title}` : 'Magiscribe';
  }, [title]);

  return <TitleContext.Provider value={{ title, setTitle }}>{children}</TitleContext.Provider>;
};
