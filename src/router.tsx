import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashboardPage from './pages/dashboard';
import AgentDashboard from './pages/dashboard/agent-lab/agents';
import AgentEdit from './pages/dashboard/agent-lab/agents/edit';
import CapabilityDashboard from './pages/dashboard/agent-lab/capabilities';
import CapabilityEdit from './pages/dashboard/agent-lab/capabilities/edit';
import PlaygroundDashboard from './pages/dashboard/agent-lab/playground';
import PromptDashboard from './pages/dashboard/agent-lab/prompts';
import PromptEdit from './pages/dashboard/agent-lab/prompts/edit';
import Contact from './pages/dashboard/contact';
import FAQPage from './pages/dashboard/faq';
import InquiriesBuilderPage from './pages/dashboard/inquiry-builder/inquiries';
import InquiryBuilderPage from './pages/dashboard/inquiry-builder/inquiry';
import HomeHero from './pages/home';
import UserInquiryPage from './pages/user-inquiry';
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
            path: '/dashboard/contact',
            element: <Contact />,
          },
          {
            path: '/dashboard/faq',
            element: <FAQPage />,
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
        path: 'inquiry/:id/:preview?',
        element: <UserInquiryPage />,
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
  {
    path: '/dashboard/inquiry-builder/:id',
    element: <InquiryBuilderTemplate />,
    children: [{ path: '', element: <InquiryBuilderPage /> }],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
