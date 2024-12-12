import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/dashboard';
import AgentDashboard from './pages/dashboard/agent-lab/agents';
import AgentEdit from './pages/dashboard/agent-lab/agents/edit';
import CapabilityDashboard from './pages/dashboard/agent-lab/capabilities';
import CapabilityEdit from './pages/dashboard/agent-lab/capabilities/edit';
import PlaygroundDashboard from './pages/dashboard/agent-lab/playground';
import PromptDashboard from './pages/dashboard/agent-lab/prompts';
import PromptEdit from './pages/dashboard/agent-lab/prompts/edit';
import Contact from './pages/contact';
import FAQPage from './pages/faq';
import InquiriesBuilderPage from './pages/dashboard/inquiry-builder/inquiries';
import InquiryBuilderPage from './pages/dashboard/inquiry-builder/inquiry';
import HomeHero from './pages/home';
import UserInquiryPage from './pages/user-inquiry';
import AgentLabTemplate from './templates/agent-lab';
import DashboardTemplate from './templates/dashboard';
import InquiryBuilderTemplate from './templates/inquiry-builder';
import InquiryUserTemplate from './templates/inquiry-user';
import Main from './templates/main';
import TermsPage from './pages/terms';
import PrivacyPage from './pages/privacy';
import UserGuidePage from './pages/dashboard/user-guide';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '',
        element: <HomeHero />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardTemplate />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'user-guide',
        element: <UserGuidePage />,
      },
      {
        path: 'agent-lab/:collection?',
        element: <AgentLabTemplate />,
        children: [
          {
            path: '',
            element: <></>,
          },
          {
            path: 'agents',
            element: <AgentDashboard />,
          },
          {
            path: 'agents/edit',
            element: <AgentEdit />,
          },
          {
            path: 'capabilities',
            element: <CapabilityDashboard />,
          },
          {
            path: 'capabilities/edit',
            element: <CapabilityEdit />,
          },
          {
            path: 'prompts',
            element: <PromptDashboard />,
          },
          {
            path: 'prompts/edit',
            element: <PromptEdit />,
          },
          {
            path: 'playground',
            element: <PlaygroundDashboard />,
          },
        ],
      },
      {
        path: 'inquiry-builder',
        children: [
          {
            path: '',
            element: <InquiriesBuilderPage />,
          },
        ],
      },
    ],
  },
  {
    path: 'inquiry',
    element: <InquiryUserTemplate />,
    children: [{ path: ':id', element: <UserInquiryPage /> }],
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
