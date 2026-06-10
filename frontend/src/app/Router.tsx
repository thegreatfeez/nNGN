import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Dashboard } from "../pages/Dashboard";
import { VaultPage } from "../pages/VaultPage";
import { LiquidationPage } from "../pages/LiquidationPage";
import { LandingPage } from "../pages/LandingPage";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <Layout />,
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
