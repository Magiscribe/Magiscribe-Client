import { ClerkProvider } from '@clerk/clerk-react';
import '@xyflow/react/dist/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './assets/styles/index.css';
import { ApolloProviderWrapper } from './clients/graphqlClient';
import { TitleProvider } from './hooks/title-hook';
import DashboardPage from './pages/dashboard';
import AgentDashboard from './pages/dashboard/agent-lab/agents';
import AgentEdit from './pages/dashboard/agent-lab/agents/edit';
import CapabilityDashboard from './pages/dashboard/agent-lab/capabilities';
import CapabilityEdit from './pages/dashboard/agent-lab/capabilities/edit';
import PlaygroundDashboard from './pages/dashboard/agent-lab/playground';
import PromptDashboard from './pages/dashboard/agent-lab/prompts';
import PromptEdit from './pages/dashboard/agent-lab/prompts/edit';
import InquiriesBuilderPage from './pages/dashboard/inquiry-builder/inquiries';
import InquiryBuilderPage from './pages/dashboard/inquiry-builder/inquiry';
import HomeHero from './pages/home';
import UserInquiryPage from './pages/user-inquiry';
import AlertProvider from './providers/alert-provider';
import AgentLabTemplate from './templates/agent-lab';
import DashboardTemplate from './templates/dashboard';
import InquiryBuilderTemplate from './templates/inquiry-builder';
import Main from './templates/main';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <HomeHero />,
      },
      {
        path: '/dashboard',
        element: <DashboardTemplate />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/dashboard/agent-lab',
            element: <AgentLabTemplate />,
            children: [
              {
                path: '/dashboard/agent-lab',
                element: <></>,
              },
              {
                path: '/dashboard/agent-lab/playground',
                element: <PlaygroundDashboard />,
              },
              {
                path: '/dashboard/agent-lab/agents',
                element: <AgentDashboard />,
              },
              {
                path: '/dashboard/agent-lab/agents/edit',
                element: <AgentEdit />,
              },
              {
                path: '/dashboard/agent-lab/capabilities',
                element: <CapabilityDashboard />,
              },
              {
                path: '/dashboard/agent-lab/capabilities/edit',
                element: <CapabilityEdit />,
              },
              {
                path: '/dashboard/agent-lab/prompts',
                element: <PromptDashboard />,
              },
              {
                path: '/dashboard/agent-lab/prompts/edit',
                element: <PromptEdit />,
              },
            ],
          },
          {
            path: '/dashboard/inquiry-builder',
            children: [
              {
                path: '/dashboard/inquiry-builder',
                element: <InquiriesBuilderPage />,
              },
            ],
          },
        ],
      },

      {
        path: 'inquiry/:id',
        element: <UserInquiryPage />,
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
  {
    path: '/dashboard/inquiry/:id',
    element: <InquiryBuilderTemplate />,
    children: [{ path: '', element: <InquiryBuilderPage /> }],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PK as string}>
      <ApolloProviderWrapper>
        <TitleProvider>
          <AlertProvider>
            <RouterProvider router={router} />
          </AlertProvider>
        </TitleProvider>
      </ApolloProviderWrapper>
    </ClerkProvider>
  </React.StrictMode>,
);
