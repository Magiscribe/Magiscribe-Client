import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./assets/styles/index.css";
import Agents from "./pages/dashboard/agents";
import Capabilities from "./pages/dashboard/capabilities";
import HomeHero from "./pages/home";
import DashboardTemplate from "./templates/dashboard";
import Main from "./templates/main";
import AgentEdit from "./pages/dashboard/agents/edit";
import CapabilityEdit from "./pages/dashboard/capabilities/edit";
import AlertProvider from "./providers/AlertProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <HomeHero />,
      },
      {
        path: "/dashboard",
        element: <DashboardTemplate />,
        children: [
          {
            path: "/dashboard",
            element: <></>,
          },
          {
            path: "/dashboard/agents",
            element: <Agents />,
          },
          {
            path: "/dashboard/agents/edit",
            element: <AgentEdit />,
          },
          {
            path: "/dashboard/capabilities",
            element: <Capabilities />,
          },
          {
            path: "/dashboard/capabilities/edit",
            element: <CapabilityEdit />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PK as string}>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
