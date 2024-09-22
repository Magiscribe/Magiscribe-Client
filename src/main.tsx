import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { ApolloProviderWrapper } from './clients/graphqlClient';
import { TitleProvider } from './hooks/title-hook';
import AlertProvider from './providers/alert-provider';
import Router from './router';

import '@xyflow/react/dist/style.css';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PK as string}>
      <ApolloProviderWrapper>
        <TitleProvider>
          <AlertProvider>
            <Router />
          </AlertProvider>
        </TitleProvider>
      </ApolloProviderWrapper>
    </ClerkProvider>
  </React.StrictMode>,
);
