import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InquiryResponseFilters } from '@/graphql/graphql';

interface AnalysisFilterContextType {
  filters: InquiryResponseFilters;
  setFilters: (filters: InquiryResponseFilters) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const AnalysisFilterContext = createContext<AnalysisFilterContextType | undefined>(undefined);

interface AnalysisFilterProviderProps {
  children: ReactNode;
}

export const AnalysisFilterProvider: React.FC<AnalysisFilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<InquiryResponseFilters>({});

  const hasActiveFilters = Object.keys(filters).length > 0 && 
    Object.values(filters).some(filter => filter && Object.keys(filter).length > 0);

  const clearFilters = () => setFilters({});

  const value: AnalysisFilterContextType = {
    filters,
    setFilters,
    hasActiveFilters,
    clearFilters
  };

  return (
    <AnalysisFilterContext.Provider value={value}>
      {children}
    </AnalysisFilterContext.Provider>
  );
};

export const useAnalysisFilters = (): AnalysisFilterContextType => {
  const context = useContext(AnalysisFilterContext);
  if (!context) {
    throw new Error('useAnalysisFilters must be used within an AnalysisFilterProvider');
  }
  return context;
};
