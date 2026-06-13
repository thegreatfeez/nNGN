import { type FC } from "react";
import { useParams, Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { Calendar, MapPin, Wallet, ArrowLeft, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useTicket } from "../hooks/useTickets";
import { Badge } from "../components/shared/Badge";
import { Spinner } from "../components/shared/Spinner";
import { formatDateTime, shortenAddress } from "../lib/utils";

export const TicketView: FC = () => {
  const { code } = useParams<{ code: string }>();
  const { data: ticket, isLoading } = useTicket(code);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4 animate-fade-in-up">
        <XCircle size={48} className="mx-auto text-rose-400" />
        <p className="text-gray-900 font-bold text-lg">Ticket not found</p>
        <p className="text-gray-400 text-sm">This ticket code doesn't exist.</p>
        <Link to="/" className="text-sm text-violet-600 hover:underline font-medium">← Back to events</Link>
      </div>
    );
  }

  const isUsed = ticket.status === "used";
  const ticketUrl = `${window.location.origin}/ticket/${ticket.ticket_code}`;

  return (
    <div className="mx-auto max-w-md px-4 py-8 space-y-4 animate-fade-in-up">
      <Link
        to="/my-tickets"
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-600 transition-colors"
      >
        <ArrowLeft size={14} /> My Tickets
      </Link>

      {/* Ticket card */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${
        isUsed ? "border-gray-200" : "border-violet-200 shadow-violet-500/5"
      } bg-white animate-ticket-drop`}>

        {/* Status banner */}
        <div className={`px-5 py-3.5 flex items-center gap-2.5 ${
          isUsed
            ? "bg-gray-50 border-b border-gray-100"
            : "bg-linear-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100"
        }`}>
          {isUsed ? (
            <XCircle size={16} className="text-gray-400 shrink-0" />
          ) : (
            <CheckCircle size={16} className="text-violet-500 shrink-0" />
          )}
          <span className={`text-sm font-semibold ${isUsed ? "text-gray-400" : "text-violet-700"}`}>
            {isUsed ? "Ticket Used" : "Valid Ticket"}
          </span>
          <div className="ml-auto">
            <Badge variant={isUsed ? "slate" : "violet"}>
              {isUsed ? "Used" : "Active"}
            </Badge>
          </div>
        </div>

        {/* Event info */}
        <div className="px-5 pt-5 pb-4 space-y-3">
          <h1 className="text-lg font-black text-gray-900 leading-snug">{ticket.event_title}</h1>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-violet-400 shrink-0" />
              {formatDateTime(ticket.event_date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-violet-400 shrink-0" />
              {ticket.venue}, {ticket.city}
            </div>
            <div className="flex items-center gap-2">
              <Wallet size={13} className="text-violet-400 shrink-0" />
              <span className="font-mono">{shortenAddress(ticket.wallet_address)}</span>
            </div>
          </div>
        </div>

        {/* Perforated divider */}
        <div className="ticket-tear mx-5 my-1" />

        {/* QR section */}
        <div className="p-5 flex flex-col items-center gap-4">
          <div className={`p-4 rounded-2xl border border-gray-100 shadow-sm transition-opacity ${isUsed ? "opacity-25" : ""}`}>
            <QRCode value={ticketUrl} size={160} />
          </div>

          {isUsed && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
              <XCircle size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">Already scanned</span>
            </div>
          )}

          <div className="text-center space-y-1 w-full">
            <p className="font-mono text-base font-bold text-gray-900 tracking-widest">
              {ticket.ticket_code}
            </p>
            <p className="text-xs text-gray-400">
              Purchased {formatDateTime(ticket.purchased_at)}
            </p>
            {isUsed && ticket.used_at && (
              <p className="text-xs text-rose-400 font-medium">
                Scanned {formatDateTime(ticket.used_at)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tx link */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-300">
        <span>Verified on-chain</span>
        <a
          href={`https://sepolia.arbiscan.io/tx/${ticket.tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-violet-400 hover:text-violet-500 font-mono font-medium transition-colors"
        >
          {ticket.tx_hash.slice(0, 10)}…{ticket.tx_hash.slice(-6)}
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
