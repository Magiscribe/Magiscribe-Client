import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProviderWrapper } from './clients/graphqlClient';
import { TitleProvider } from './hooks/title-hook';
import AlertProvider from './providers/alert-provider';
import Router from './router';

import '@xyflow/react/dist/style.css';
import './assets/styles/index.css';
import { ErrorBoundary } from './components/errors/error-boundary';
import './i18n/i18n';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PK as string}>
        <ApolloProviderWrapper>
          <TitleProvider>
            <AlertProvider>
              <Router />
            </AlertProvider>
          </TitleProvider>
        </ApolloProviderWrapper>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
