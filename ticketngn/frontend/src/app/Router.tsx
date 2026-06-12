import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Home } from "../pages/Home";
import { EventDetail } from "../pages/EventDetail";
import { MyTickets } from "../pages/MyTickets";
import { TicketView } from "../pages/TicketView";
import { AdminLogin } from "../pages/admin/AdminLogin";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminEventsList } from "../pages/admin/AdminEventsList";
import { AdminEventForm } from "../pages/admin/AdminEventForm";
import { AdminEventDetail } from "../pages/admin/AdminEventDetail";
import { AdminScan } from "../pages/admin/AdminScan";
import { AdminLayout } from "../components/admin/AdminLayout";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/events/:id", element: <EventDetail /> },
      { path: "/my-tickets", element: <MyTickets /> },
      { path: "/ticket/:code", element: <TicketView /> },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <AdminLogin />
      </div>
    ),
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "events", element: <AdminEventsList /> },
      { path: "events/new", element: <AdminEventForm /> },
      { path: "events/:id", element: <AdminEventDetail /> },
      { path: "events/:id/edit", element: <AdminEventForm /> },
      { path: "scan", element: <AdminScan /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
