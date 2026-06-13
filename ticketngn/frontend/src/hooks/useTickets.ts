import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useTicket(code: string | undefined) {
  return useQuery({
    queryKey: ["ticket", code],
    queryFn: () => api.getTicket(code!),
    enabled: !!code,
  });
}

export function useMyTickets(wallet: string | undefined) {
  return useQuery({
    queryKey: ["my-tickets", wallet],
    queryFn: () => api.getMyTickets(wallet!),
    enabled: !!wallet,
  });
}
