import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@xyflow/react/dist/style.css';
import './assets/styles/index.css';
import { ApolloProviderWrapper } from './clients/graphqlClient';
import { TitleProvider } from './hooks/TitleHook';
import HomeHero from './pages/home';
import AlertProvider from './providers/alert-provider';
import Main from './templates/main';
import AgentLabTemplate from './templates/agent-lab';
import PlaygroundDashboard from './pages/dashboard/agent-lab/playground';
import AgentDashboard from './pages/dashboard/agent-lab/agents';
import AgentEdit from './pages/dashboard/agent-lab/agents/edit';
import CapabilityDashboard from './pages/dashboard/agent-lab/capabilities';
import CapabilityEdit from './pages/dashboard/agent-lab/capabilities/edit';
import PromptDashboard from './pages/dashboard/agent-lab/prompts';
import PromptEdit from './pages/dashboard/agent-lab/prompts/edit';
import Inquiry from './pages/dashboard/stakeholder/main';
import InquiryPage from './pages/inquiry';
import DashboardPage from './pages/dashboard';
import DashboardTemplate from './templates/dashboard';

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
            path: '/dashboard/inquiry',
            children: [
              {
                path: '/dashboard/inquiry',
                element: <Inquiry />,
              },
              {
                path: '/dashboard/inquiry/:id',
                element: <Inquiry />,
              },
            ],
          },
        ],
      },
      {
        path: 'inquiry/:id',
        element: <InquiryPage />,
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
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
