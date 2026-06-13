import type { Event, Ticket } from "./api";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...init?.headers,
    },
    ...init,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export interface Stats {
  totalEvents: number;
  totalTickets: number;
  totalNgn: number;
  activeEvents: number;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  venue: string;
  city: string;
  image_url?: string;
  capacity: number;
  price_ngn: string;
  is_active?: boolean;
}

export const adminApi = {
  login: (pin: string) =>
    fetch(`${BASE}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Login failed");
      return d as { token: string };
    }),

  getStats: () => request<Stats>("/api/admin/stats"),

  getEvents: () => request<Event[]>("/api/admin/events"),
  getEvent: (id: string) => request<Event>(`/api/admin/events/${id}`),
  createEvent: (data: EventFormData) =>
    request<Event>("/api/admin/events", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id: string, data: Partial<EventFormData>) =>
    request<Event>(`/api/admin/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id: string) =>
    request<{ message: string }>(`/api/admin/events/${id}`, { method: "DELETE" }),

  getEventTickets: (eventId: string) =>
    request<Ticket[]>(`/api/admin/events/${eventId}/tickets`),

  markTicketUsed: (code: string) =>
    request<{ success: boolean; ticket: Ticket }>(`/api/admin/tickets/${code}/use`, {
      method: "POST",
    }),
};
