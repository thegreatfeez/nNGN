import { type FC } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Calendar, MapPin, Users, Coins, Ticket } from "lucide-react";
import { adminApi } from "../../lib/adminApi";
import { Badge } from "../../components/shared/Badge";
import { Spinner } from "../../components/shared/Spinner";
import { formatDate, formatDateTime, shortenAddress } from "../../lib/utils";
import type { Ticket as TicketType } from "../../lib/api";

export const AdminEventDetail: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["admin-events", id],
    queryFn: () => adminApi.getEvent(id!),
    enabled: !!id,
  });

  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["admin-event-tickets", id],
    queryFn: () => adminApi.getEventTickets(id!),
    enabled: !!id,
  });

  if (eventLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!event) return <div className="p-8 text-gray-400">Event not found.</div>;

  const revenue = tickets
    ? (tickets.length * Number(event.price_raw)) / 1e18
    : null;

  return (
    <div className="p-8 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/events"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{event.title}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{event.city}</p>
          </div>
        </div>
        <Link to={`/admin/events/${id}/edit`}>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-violet-300 hover:text-violet-700 transition-colors shadow-sm">
            <Pencil size={14} /> Edit
          </button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MiniStat icon={<Calendar size={13} className="text-blue-500" />} bg="bg-blue-50" label="Date" value={formatDate(event.date)} />
        <MiniStat icon={<MapPin size={13} className="text-violet-500" />} bg="bg-violet-50" label="Venue" value={event.venue} />
        <MiniStat icon={<Users size={13} className="text-fuchsia-500" />} bg="bg-fuchsia-50" label="Capacity" value={`${event.tickets_sold} / ${event.capacity}`} />
        <MiniStat
          icon={<Coins size={13} className="text-amber-500" />}
          bg="bg-amber-50"
          label="Revenue"
          value={
            revenue !== null
              ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(revenue)
              : "—"
          }
        />
      </div>

      {/* Tickets table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">
            Tickets{" "}
            <span className="text-gray-400 font-normal text-sm">({tickets?.length ?? 0})</span>
          </h2>
          <div className="flex gap-2">
            <Badge variant={event.is_active ? "green" : "slate"}>
              {event.is_active ? "Active" : "Inactive"}
            </Badge>
            {event.sold_out && <Badge variant="red">Sold Out</Badge>}
          </div>
        </div>

        {ticketsLoading ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : !tickets?.length ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <Ticket size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm font-medium">No tickets sold yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Ticket Code</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Wallet</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Purchased</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((t) => (
                  <TicketRow key={t.id} ticket={t} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const TicketRow: FC<{ ticket: TicketType }> = ({ ticket }) => (
  <tr className="hover:bg-gray-50/60 transition-colors">
    <td className="px-4 py-3.5">
      <Link
        to={`/ticket/${ticket.ticket_code}`}
        target="_blank"
        className="font-mono text-violet-500 hover:text-violet-700 hover:underline text-xs font-semibold"
      >
        {ticket.ticket_code}
      </Link>
    </td>
    <td className="px-4 py-3.5 font-mono text-xs text-gray-400 hidden md:table-cell">
      {shortenAddress(ticket.wallet_address)}
    </td>
    <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
      {formatDateTime(ticket.purchased_at)}
    </td>
    <td className="px-4 py-3.5">
      <Badge variant={ticket.status === "active" ? "green" : "slate"}>
        {ticket.status === "active" ? "Active" : "Used"}
      </Badge>
    </td>
  </tr>
);

const MiniStat: FC<{ icon: React.ReactNode; bg: string; label: string; value: string }> = ({
  icon, bg, label, value,
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 space-y-2">
    <div className={`h-7 w-7 rounded-lg ${bg} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);
