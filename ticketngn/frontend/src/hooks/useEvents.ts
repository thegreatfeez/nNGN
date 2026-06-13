import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useEvents() {
  return useQuery({ queryKey: ["events"], queryFn: api.getEvents });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => api.getEvent(id!),
    enabled: !!id,
  });
}
