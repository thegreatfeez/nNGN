import { type FC } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Ticket, ArrowRight, Zap } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import { Badge } from "../components/shared/Badge";
import { formatDate } from "../lib/utils";
import type { Event } from "../lib/api";

export const Home: FC = () => {
  const { data: events, isLoading, error } = useEvents();

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="gradient-hero px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-violet-200 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-700 animate-fade-in-up">
          <Zap size={11} className="fill-violet-500 text-violet-500" />
          Powered by nNGN · Arbitrum Sepolia
        </div>

        <div className="animate-fade-in-up stagger-1 space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            Nigeria's Events,{" "}
            <span className="gradient-text">On-Chain</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Buy tickets to the best Nigerian tech events with nNGN — the naira stablecoin on Arbitrum.
          </p>
        </div>

        <div className="animate-fade-in-up stagger-2 flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/#events"
            className="btn-gradient text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm"
          >
            Browse Events <ArrowRight size={15} />
          </Link>
          <Link
            to="/my-tickets"
            className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm hover:border-violet-300 hover:text-violet-700 transition-colors shadow-sm"
          >
            <Ticket size={15} /> My Tickets
          </Link>
        </div>

        {/* Quick stats */}
        <div className="animate-fade-in-up stagger-3 flex items-center justify-center gap-8 pt-2 flex-wrap">
          {[
            { value: `${events?.length ?? 0}`, label: "Upcoming Events" },
            { value: "nNGN", label: "Payment Token" },
            { value: "Instant", label: "Ticket Delivery" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Events grid ────────────────────────────────────── */}
      <section id="events" className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          {events && (
            <span className="text-sm text-gray-400">{events.length} events</span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-10 text-center">
            <p className="text-rose-600 font-medium">Failed to load events</p>
            <p className="text-rose-400 text-sm mt-1">Make sure the backend is running on port 3001</p>
          </div>
        ) : !events?.length ? (
          <div className="text-center py-20 text-gray-400">No events yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* ── Event Card ─────────────────────────────────────────────── */
const EventCard: FC<{ event: Event; className?: string }> = ({ event, className = "" }) => (
  <Link
    to={event.sold_out ? "#" : `/events/${event.id}`}
    className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover flex flex-col ${className} ${event.sold_out ? "pointer-events-none" : ""}`}
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden bg-linear-to-br from-violet-100 to-fuchsia-100">
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Ticket size={36} className="text-violet-300" />
        </div>
      )}

      {/* City badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <MapPin size={10} /> {event.city}
        </span>
      </div>

      {/* Sold out overlay */}
      {event.sold_out && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <span className="bg-rose-500 text-white font-bold text-sm px-4 py-1.5 rounded-full rotate-[-8deg] shadow-lg">
            SOLD OUT
          </span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col gap-3 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{event.title}</h3>
        <Badge variant={event.sold_out ? "red" : "amber"}>
          {event.sold_out ? "Sold Out" : event.price_display}
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs text-gray-400 flex-1">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-violet-400" />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-violet-400" />
          {event.venue}
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={11} className="text-violet-400" />
          {event.capacity - event.tickets_sold} spots remaining
        </div>
      </div>

      {/* CTA */}
      <div
        className={`mt-auto text-xs font-semibold text-center py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
          event.sold_out
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white"
        }`}
      >
        {event.sold_out ? "Sold Out" : (<>Get Ticket <ArrowRight size={12} /></>)}
      </div>
    </div>
  </Link>
);

/* ── Skeleton Card ──────────────────────────────────────────── */
const EventCardSkeleton: FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="skeleton h-48" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-9 mt-2 rounded-xl" />
    </div>
  </div>
);
