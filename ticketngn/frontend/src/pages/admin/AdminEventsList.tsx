import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, Calendar, Users, Coins } from "lucide-react";
import { adminApi } from "../../lib/adminApi";
import { Badge } from "../../components/shared/Badge";
import { Button } from "../../components/shared/Button";
import { Spinner } from "../../components/shared/Spinner";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export const AdminEventsList: FC = () => {
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: adminApi.getEvents,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Deactivate "${title}"? It will no longer appear publicly.`)) return;
    setDeletingId(id);
    try {
      await adminApi.deleteEvent(id);
      toast.success("Event deactivated");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch {
      toast.error("Failed to deactivate event");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Events</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {events?.length ?? 0} total events
          </p>
        </div>
        <Link to="/admin/events/new">
          <Button><Plus size={15} /> New Event</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !events?.length ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-14 text-center space-y-3">
          <p className="text-gray-600 font-semibold">No events yet</p>
          <Link to="/admin/events/new">
            <Button variant="secondary">Create your first event</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Event</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Tickets</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {event.image_url ? (
                        <img src={event.image_url} alt="" className="h-9 w-9 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100 shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-400">{event.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar size={12} className="text-violet-400" />
                      {formatDate(event.date)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Users size={12} className="text-violet-400" />
                      {event.tickets_sold} / {event.capacity}
                      {event.sold_out && <Badge variant="red">Full</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                      <Coins size={12} className="text-amber-400" />
                      {event.price_display}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={event.is_active ? "green" : "slate"}>
                      {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/admin/events/${event.id}`}>
                        <button className="p-1.5 rounded-lg text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                          <Eye size={14} />
                        </button>
                      </Link>
                      <Link to={`/admin/events/${event.id}/edit`}>
                        <button className="p-1.5 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deletingId === event.id || !event.is_active}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {deletingId === event.id ? <Spinner size="sm" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
