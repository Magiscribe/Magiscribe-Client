import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './assets/styles/index.css';
import AgentDashboard from './pages/dashboard/agents';
import HomeHero from './pages/home';
import DashboardTemplate from './templates/dashboard';
import Main from './templates/main';
import AgentEdit from './pages/dashboard/agents/edit';
import AlertProvider from './providers/AlertProvider';
import PromptDashboard from './pages/dashboard/prompts';
import PromptEdit from './pages/dashboard/prompts/edit';
import CapabilityDashboard from './pages/dashboard/capabilities';
import CapabilityEdit from './pages/dashboard/capabilities/edit';
import PlaygroundDashboard from './pages/dashboard/playground';
import { TitleProvider } from './hooks/TitleHook';

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
            element: <></>,
          },
          {
            path: '/dashboard/playground',
            element: <PlaygroundDashboard />,
          },
          {
            path: '/dashboard/agents',
            element: <AgentDashboard />,
          },
          {
            path: '/dashboard/agents/edit',
            element: <AgentEdit />,
          },
          {
            path: '/dashboard/capabilities',
            element: <CapabilityDashboard />,
          },
          {
            path: '/dashboard/capabilities/edit',
            element: <CapabilityEdit />,
          },
          {
            path: '/dashboard/prompts',
            element: <PromptDashboard />,
          },
          {
            path: '/dashboard/prompts/edit',
            element: <PromptEdit />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PK as string}>
      <TitleProvider>
        <AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider>
      </TitleProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
