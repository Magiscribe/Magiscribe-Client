import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./assets/styles/index.css";
import Agents from "./pages/dashboard/agents";
import Capabilities from "./pages/dashboard/capabilities";
import Home from "./pages/home";
import DashboardTemplate from "./templates/dashboard";
import Main from "./templates/main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
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
            path: "/dashboard/capabilities",
            element: <Capabilities />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PK as string}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);
