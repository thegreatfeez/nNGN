const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  city: string;
  image_url: string | null;
  capacity: number;
  tickets_sold: number;
  price_raw: string;
  price_display: string;
  is_active: boolean;
  sold_out: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  wallet_address: string;
  tx_hash: string;
  ticket_code: string;
  status: "active" | "used";
  purchased_at: string;
  used_at: string | null;
  event_title: string;
  event_date: string;
  venue: string;
  city: string;
  image_url: string | null;
}

export const api = {
  getEvents: () => request<Event[]>("/api/events"),
  getEvent: (id: string) => request<Event>(`/api/events/${id}`),
  getTicket: (code: string) => request<Ticket>(`/api/tickets/${code}`),
  getMyTickets: (wallet: string) =>
    request<Ticket[]>(`/api/tickets?wallet=${wallet}`),
  purchase: (eventId: string, body: { txHash: string; walletAddress: string }) =>
    request<{ ticket: Ticket; event: Pick<Event, "title" | "date" | "venue" | "city"> }>(
      `/api/events/${eventId}/purchase`,
      { method: "POST", body: JSON.stringify(body) }
    ),
};
