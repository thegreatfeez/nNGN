import { type FC } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { Ticket, Calendar, MapPin, ArrowRight } from "lucide-react";
import { useMyTickets } from "../hooks/useTickets";
import { Badge } from "../components/shared/Badge";
import { Spinner } from "../components/shared/Spinner";
import { formatDate } from "../lib/utils";
import type { Ticket as TicketType } from "../lib/api";

export const MyTickets: FC = () => {
  const { address, isConnected } = useAccount();
  const { data: tickets, isLoading } = useMyTickets(address);

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-5 animate-fade-in-up">
        <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mx-auto">
          <Ticket size={28} className="text-violet-500" />
        </div>
        <div className="space-y-1">
          <p className="text-gray-900 font-bold text-xl">Connect your wallet</p>
          <p className="text-gray-400 text-sm">Your tickets will appear here once you connect.</p>
        </div>
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        {tickets && (
          <span className="text-sm text-gray-400">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !tickets?.length ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-14 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mx-auto">
            <Ticket size={24} className="text-violet-400" />
          </div>
          <div className="space-y-1">
            <p className="text-gray-700 font-semibold">No tickets yet</p>
            <p className="text-gray-400 text-sm">Browse events and buy your first ticket with nNGN</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold"
          >
            Browse Events <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket, i) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TicketRow: FC<{ ticket: TicketType; className?: string }> = ({ ticket, className = "" }) => (
  <Link
    to={`/ticket/${ticket.ticket_code}`}
    className={`flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 card-hover ${className}`}
  >
    {ticket.image_url ? (
      <img
        src={ticket.image_url}
        alt={ticket.event_title}
        className="h-14 w-14 rounded-xl object-cover shrink-0"
      />
    ) : (
      <div className="h-14 w-14 rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center shrink-0">
        <Ticket size={20} className="text-violet-400" />
      </div>
    )}

    <div className="flex-1 min-w-0 space-y-1">
      <p className="font-semibold text-gray-900 truncate">{ticket.event_title}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="text-violet-400" /> {formatDate(ticket.event_date)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-violet-400" /> {ticket.venue}, {ticket.city}
        </span>
      </div>
      <p className="text-xs font-mono text-gray-300">{ticket.ticket_code}</p>
    </div>

    <div className="flex flex-col items-end gap-2 shrink-0">
      <Badge variant={ticket.status === "active" ? "green" : "slate"}>
        {ticket.status === "active" ? "Active" : "Used"}
      </Badge>
      <ArrowRight size={14} className="text-gray-300" />
    </div>
  </Link>
);
