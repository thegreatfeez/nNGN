import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Dashboard } from "../pages/Dashboard";
import { VaultPage } from "../pages/VaultPage";
import { LiquidationPage } from "../pages/LiquidationPage";
import { LandingPage } from "../pages/LandingPage";
import { ComingSoon } from "../pages/ComingSoon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/coming-soon",
    element: <ComingSoon />,
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/vault", element: <VaultPage /> },
      { path: "/liquidate", element: <LiquidationPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
