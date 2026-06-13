import { type FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { adminApi, type EventFormData } from "../../lib/adminApi";
import { Button } from "../../components/shared/Button";
import { Spinner } from "../../components/shared/Spinner";
import { ImageUpload } from "../../components/admin/ImageUpload";
import toast from "react-hot-toast";

const EMPTY: EventFormData = {
  title: "",
  description: "",
  date: "",
  venue: "",
  city: "",
  image_url: "",
  capacity: 100,
  price_ngn: "",
  is_active: true,
};

export const AdminEventForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ["admin-events", id],
    queryFn: () => adminApi.getEvent(id!),
    enabled: isEdit,
  });

  const [form, setForm] = useState<EventFormData>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing) return;
    const priceNgn = String(Number(existing.price_raw) / 1e18);
    setForm({
      title: existing.title,
      description: existing.description ?? "",
      date: existing.date.slice(0, 16),
      venue: existing.venue,
      city: existing.city,
      image_url: existing.image_url ?? "",
      capacity: existing.capacity,
      price_ngn: priceNgn,
      is_active: existing.is_active,
    });
  }, [existing]);

  function set(field: keyof EventFormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.updateEvent(id!, form);
        toast.success("Event updated");
      } else {
        await adminApi.createEvent(form);
        toast.success("Event created");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      navigate("/admin/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && loadingExisting) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-8 max-w-2xl space-y-6 animate-fade-in-up">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {isEdit ? "Edit Event" : "New Event"}
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {isEdit ? "Update event details below." : "Fill in the details to create a new event."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title *">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Lagos Dev Summit 2026"
            className={inputCls}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Describe your event..."
            className={`${inputCls} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date & Time *">
            <input
              required
              type="datetime-local"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Price (₦ nNGN) *">
            <input
              required
              type="number"
              min="1"
              step="1"
              value={form.price_ngn}
              onChange={(e) => set("price_ngn", e.target.value)}
              placeholder="2000"
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Venue *">
            <input
              required
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="Landmark Event Centre"
              className={inputCls}
            />
          </Field>
          <Field label="City *">
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Lagos"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Capacity *">
          <input
            required
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => set("capacity", Number(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="Event Image">
          <ImageUpload
            value={form.image_url ?? ""}
            onChange={(url) => set("image_url", url)}
          />
        </Field>

        {isEdit && (
          <Field label="Status">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-checked:bg-violet-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Active (visible to public)</span>
            </label>
          </Field>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEdit ? "Save Changes" : "Create Event"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

const inputCls =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm transition-all";

const Field: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);
