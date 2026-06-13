import { customAlphabet } from "nanoid";

const segment = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

export function generateTicketCode() {
  return `TKT-${segment()}-${segment()}`;
}
