import { type FC, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  MapPin, Calendar, Users, Wallet, CheckCircle,
  ArrowRight, Ticket, Zap, Shield, Star,
} from "lucide-react";
import { useEvent, useEvents } from "../hooks/useEvents";
import { useNgnBalance } from "../hooks/useNgnBalance";
import { usePayWithNgn } from "../hooks/usePayWithNgn";
import { Modal } from "../components/shared/Modal";
import { Spinner } from "../components/shared/Spinner";
import { formatDate, formatTime } from "../lib/utils";
import { ngnBalanceDisplay } from "../lib/nngn";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import type { Event } from "../lib/api";

const RECIPIENT = import.meta.env.VITE_RECIPIENT_WALLET as `0x${string}` | undefined;

export const EventDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id);
  const { data: allEvents } = useEvents();
  const { address, isConnected } = useAccount();
  const balance = useNgnBalance(address);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Ticket size={40} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Event not found.</p>
        <Link to="/" className="text-violet-600 text-sm hover:underline">← Back to events</Link>
      </div>
    );
  }

  const priceRaw = BigInt(event.price_raw);
  const hasSufficientBalance = balance !== null && balance >= priceRaw;
  const spotsLeft = event.capacity - event.tickets_sold;
  const soldPct = Math.round((event.tickets_sold / event.capacity) * 100);
  const related = allEvents?.filter((e) => e.id !== event.id && e.is_active).slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[560px] md:h-[680px] w-full overflow-hidden">
        {/* Image */}
        <div className="absolute inset-0">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-violet-200 via-fuchsia-100 to-violet-50" />
          )}
          {/* Gradient overlays — fade to white at bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-white/80 via-transparent to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative h-full flex flex-col justify-end px-4 md:px-20 pb-14 max-w-7xl mx-auto">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-violet-200 text-violet-700 text-xs font-semibold shadow-sm">
              <CheckCircle size={12} className="text-violet-500" /> Official Event
            </span>
            {spotsLeft < event.capacity * 0.3 && !event.sold_out && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-amber-200 text-amber-700 text-xs font-semibold shadow-sm">
                <Zap size={12} className="fill-amber-500 text-amber-500" /> Selling Fast
              </span>
            )}
            {event.sold_out && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-3xl mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-5 items-center text-gray-500">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Calendar size={15} className="text-violet-500" />
              {formatDate(event.date)} · {formatTime(event.date)}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin size={15} className="text-violet-500" />
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">

          {/* ── Left column ── */}
          <div className="md:col-span-7 lg:col-span-8 space-y-12">

            {/* About */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-600">About the Event</h2>
              <p className="text-gray-500 leading-relaxed text-base">
                {event.description || "Join us for an incredible evening of unforgettable experiences."}
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Shield size={28} className="text-violet-500" />,
                  bg: "bg-violet-50",
                  title: "Blockchain Verified",
                  desc: "Your ticket is secured on Arbitrum. Tamper-proof and instantly verifiable.",
                },
                {
                  icon: <Zap size={28} className="text-amber-500" />,
                  bg: "bg-amber-50",
                  title: "Instant Delivery",
                  desc: "Receive your QR code immediately after the transaction confirms on-chain.",
                },
              ].map(({ icon, bg, title, desc }) => (
                <div key={title} className={`${bg} rounded-2xl border border-gray-100 p-5 space-y-2`}>
                  {icon}
                  <h3 className="font-bold text-gray-900 text-base">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Calendar size={14} className="text-violet-500" />, label: "Date & Time", value: `${formatDate(event.date)} · ${formatTime(event.date)}` },
                { icon: <MapPin size={14} className="text-violet-500" />, label: "Venue", value: `${event.venue}, ${event.city}` },
                { icon: <Users size={14} className="text-violet-500" />, label: "Availability", value: `${spotsLeft} of ${event.capacity} spots left` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {icon}
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Location placeholder */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-violet-600">Location</h2>
              <div className="h-56 rounded-2xl overflow-hidden border border-gray-100 bg-linear-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center shadow-sm">
                <div className="text-center space-y-2">
                  <div className="relative mx-auto w-10 h-10">
                    <div className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-40" />
                    <div className="relative h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center border-4 border-white shadow">
                      <MapPin size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{event.venue}</p>
                  <p className="text-xs text-gray-400">{event.city}, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column — sticky purchase card ── */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="md:sticky md:top-24 space-y-4">

              {/* Price / buy card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-violet-500/5 p-6 space-y-5 relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-100 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-start relative">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Entry Price</p>
                    <p className="text-4xl font-black gradient-text leading-none">{event.price_display}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">nNGN · Arbitrum Sepolia</p>
                  </div>
                  {!event.sold_out && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium">Capacity</p>
                      <p className="text-violet-600 font-bold text-sm">{soldPct}% sold</p>
                    </div>
                  )}
                </div>

                {/* Capacity bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>{event.tickets_sold} sold</span>
                    <span>{event.capacity} total</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                      style={{ width: `${soldPct}%` }}
                    />
                  </div>
                </div>

                {/* Wallet balance */}
                {isConnected && balance !== null && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-linear-to-tr from-violet-100 to-fuchsia-100 flex items-center justify-center border border-violet-200">
                        <Wallet size={16} className="text-violet-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Your Balance</p>
                        <p className="text-sm font-bold text-gray-900 font-mono">
                          {ngnBalanceDisplay(balance)} nNGN
                        </p>
                      </div>
                    </div>
                    {hasSufficientBalance ? (
                      <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-xs text-rose-500 font-semibold">Low</span>
                    )}
                  </div>
                )}

                {/* CTA */}
                {!isConnected ? (
                  <div className="space-y-3 text-center">
                    <p className="text-sm text-gray-400">Connect your wallet to purchase</p>
                    <appkit-button />
                  </div>
                ) : event.sold_out ? (
                  <button disabled className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm cursor-not-allowed">
                    Sold Out
                  </button>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    disabled={!hasSufficientBalance}
                    className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                      hasSufficientBalance
                        ? "btn-gradient text-white active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Ticket size={17} />
                    {hasSufficientBalance ? "Buy Ticket Now" : "Insufficient Balance"}
                  </button>
                )}

                {isConnected && !hasSufficientBalance && !event.sold_out && (
                  <p className="text-xs text-gray-400 text-center">
                    Need nNGN?{" "}
                    <a
                      href={import.meta.env.VITE_NAIRA_STABLE_URL ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 font-semibold hover:underline"
                    >
                      Mint on NairaStable →
                    </a>
                  </p>
                )}

                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <Shield size={11} className="text-gray-300" />
                  <p className="text-center text-xs text-gray-300 font-medium">
                    Transaction secured by Arbitrum blockchain
                  </p>
                </div>
              </div>

              {/* Ticket preview — floating animation */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-ticket-drop">
                {/* Top section */}
                <div className="bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-4 flex items-center justify-between">
                  <span className="text-white font-extrabold tracking-tight text-sm">TicketNGN</span>
                  <span className="text-white/60 font-mono text-xs">Preview</span>
                </div>

                {/* Perforated divider */}
                <div className="ticket-tear bg-white" />

                {/* Bottom section */}
                <div className="bg-white px-5 py-4 flex items-center gap-4">
                  <div className="h-12 w-12 bg-linear-to-br from-violet-100 to-fuchsia-100 rounded-xl border border-violet-200 flex items-center justify-center shrink-0">
                    <Ticket size={20} className="text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-violet-600 font-mono font-bold mt-0.5">1 × ENTRY</p>
                  </div>
                  <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED EVENTS ────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-14 mt-4">
          <div className="max-w-7xl mx-auto px-4 md:px-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-black text-gray-900">Upcoming Experiences</h2>
              <Link
                to="/"
                className="text-violet-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((e) => (
                <RelatedEventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        eventId={event.id}
        eventTitle={event.title}
        priceDisplay={event.price_display}
        priceNgn={String(Number(event.price_raw) / 1e18)}
        recipient={RECIPIENT ?? ("0x0000000000000000000000000000000000000000" as `0x${string}`)}
        walletAddress={address!}
        onSuccess={(code) => navigate(`/ticket/${code}`)}
      />
    </div>
  );
};

/* ── Related event card ──────────────────────────────────── */
const RelatedEventCard: FC<{ event: Event }> = ({ event }) => (
  <Link
    to={`/events/${event.id}`}
    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover flex flex-col"
  >
    <div className="h-44 overflow-hidden relative bg-linear-to-br from-violet-100 to-fuchsia-100">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
        {formatDate(event.date)}
      </div>
      <div className="absolute inset-0 bg-violet-600/10 mix-blend-overlay" />
    </div>
    <div className="p-4 space-y-3 flex-1 flex flex-col">
      <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
        {event.title}
      </h3>
      {event.description && (
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">{event.description}</p>
      )}
      <div className="flex justify-between items-center pt-1">
        <span className="gradient-text font-bold text-sm">{event.price_display}</span>
        <ArrowRight size={14} className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  </Link>
);

/* ── Payment Modal ────────────────────────────────────────── */
interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  priceDisplay: string;
  priceNgn: string;
  recipient: `0x${string}`;
  walletAddress: `0x${string}`;
  onSuccess: (ticketCode: string) => void;
}

const paySteps = [
  { key: "signing",    label: "Sign transaction in wallet" },
  { key: "confirming", label: "Waiting for on-chain confirmation" },
  { key: "verifying",  label: "Backend verifying payment" },
];

const PaymentModal: FC<PaymentModalProps> = ({
  open, onClose, eventId, eventTitle, priceDisplay,
  priceNgn, recipient, walletAddress, onSuccess,
}) => {
  const { pay, txHash, step, confirmed, error, reset } = usePayWithNgn();

  useEffect(() => {
    if (!confirmed || !txHash || step !== "confirming") return;
    const verify = async () => {
      try {
        const { ticket } = await api.purchase(eventId, { txHash, walletAddress });
        toast.success("🎟 Ticket issued!");
        onSuccess(ticket.ticket_code);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Verification failed");
      }
    };
    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed, txHash]);

  function handleClose() { reset(); onClose(); }

  const passedStep = (s: string) =>
    (s === "signing"    && (["confirming", "verifying", "done"] as string[]).includes(step)) ||
    (s === "confirming" && (["verifying", "done"] as string[]).includes(step));

  return (
    <Modal open={open} onClose={handleClose} title="Complete Purchase">
      <div className="space-y-5">
        {/* Summary */}
        <div className="bg-linear-to-r from-violet-50 to-fuchsia-50 rounded-xl border border-violet-100 px-4 py-3.5">
          <p className="text-sm font-semibold text-gray-700">{eventTitle}</p>
          <p className="text-3xl font-black gradient-text mt-0.5 leading-none">{priceDisplay}</p>
          <p className="text-xs text-gray-400 mt-1">nNGN · Arbitrum Sepolia</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {paySteps.map(({ key, label }) => {
            const done   = passedStep(key);
            const active = step === key;
            return (
              <div key={key} className="flex items-center gap-3">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  done   ? "border-violet-500 bg-violet-500" :
                  active ? "border-violet-500 pulse-glow"   :
                           "border-gray-200"
                }`}>
                  {done   && <span className="text-white text-[10px] font-bold">✓</span>}
                  {active && <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />}
                </div>
                <span className={`text-sm flex-1 ${
                  done   ? "text-gray-300 line-through" :
                  active ? "text-gray-900 font-semibold" :
                           "text-gray-300"
                }`}>
                  {label}
                </span>
                {active && <Spinner size="sm" />}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600 font-medium">
            {error}
          </div>
        )}

        {error ? (
          <button
            onClick={reset}
            className="w-full py-3 rounded-xl border-2 border-violet-500 text-violet-600 font-bold text-sm hover:bg-violet-50 transition-colors"
          >
            Try Again
          </button>
        ) : step === "idle" ? (
          <button
            onClick={() => pay(recipient, priceNgn)}
            className="w-full py-3.5 rounded-xl btn-gradient text-white font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Ticket size={16} /> Confirm · Pay {priceDisplay} nNGN
          </button>
        ) : null}
      </div>
    </Modal>
  );
};
