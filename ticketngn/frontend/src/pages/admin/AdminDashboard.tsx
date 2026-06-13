import { type FC } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Ticket, Coins, Zap, ArrowRight, Plus } from "lucide-react";
import { adminApi } from "../../lib/adminApi";
import { Spinner } from "../../components/shared/Spinner";
import { formatNgnNumber } from "../../lib/utils";

export const AdminDashboard: FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
    refetchInterval: 30_000,
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Overview of TicketNGN activity</p>
        </div>
        <Link
          to="/admin/events/new"
          className="btn-gradient inline-flex items-center gap-2 text-white font-semibold text-sm px-4 py-2.5 rounded-xl"
        >
          <Plus size={15} /> New Event
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<CalendarDays size={16} className="text-blue-500" />}
            label="Total Events"
            value={String(stats?.totalEvents ?? 0)}
            bg="bg-blue-50"
          />
          <StatCard
            icon={<Zap size={16} className="text-emerald-500" />}
            label="Active Events"
            value={String(stats?.activeEvents ?? 0)}
            bg="bg-emerald-50"
          />
          <StatCard
            icon={<Ticket size={16} className="text-violet-500" />}
            label="Tickets Sold"
            value={String(stats?.totalTickets ?? 0)}
            bg="bg-violet-50"
          />
          <StatCard
            icon={<Coins size={16} className="text-amber-500" />}
            label="nNGN Received"
            value={stats ? formatNgnNumber(stats.totalNgn) : "—"}
            bg="bg-amber-50"
          />
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionCard
            to="/admin/events/new"
            icon={<Plus size={18} className="text-violet-500" />}
            iconBg="bg-violet-50"
            title="Create Event"
            desc="Add a new event to the platform"
          />
          <ActionCard
            to="/admin/events"
            icon={<CalendarDays size={18} className="text-blue-500" />}
            iconBg="bg-blue-50"
            title="Manage Events"
            desc="Edit, deactivate, or view tickets"
          />
          <ActionCard
            to="/admin/scan"
            icon={<Ticket size={18} className="text-fuchsia-500" />}
            iconBg="bg-fuchsia-50"
            title="Scan QR"
            desc="Verify and mark tickets at the door"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}> = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 space-y-3">
    <div className={`h-8 w-8 rounded-xl ${bg} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="text-2xl font-black text-gray-900 tabular-nums mt-0.5">{value}</p>
    </div>
  </div>
);

const ActionCard: FC<{
  to: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
}> = ({ to, icon, iconBg, title, desc }) => (
  <Link
    to={to}
    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 card-hover group"
  >
    <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </div>
    <ArrowRight size={14} className="text-gray-300 group-hover:text-violet-400 transition-colors shrink-0" />
  </Link>
);
