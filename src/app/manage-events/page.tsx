"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { useAuth } from "@/context/AuthProvider";

export interface ManagedEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  city?: string;
  venue?: string;
  address?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationType: string;
  registrationDeadline: string;
  registrationLimit?: number;
  requiredSkills?: string[];
  responsibilities?: string;
  volunteerCapacity: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface EditFormData {
  title: string;
  description: string;
  category: string;
  city: string;
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationType: string;
  registrationDeadline: string;
  registrationLimit: string;
  requiredSkills: string;
  responsibilities: string;
  volunteerCapacity: string;
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Date not specified";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Date not specified";
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getMyEvents(token: string): Promise<ManagedEvent[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is missing");
  }

  const res = await fetch(`${serverUrl}/my-events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized: Please sign in.");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch your events. Status: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data as ManagedEvent[];
}

async function updateEvent(
  token: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is missing");
  }

  const res = await fetch(`${serverUrl}/upcoming-events/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized: Please sign in.");
  }

  if (res.status === 403) {
    throw new Error("You can only update events you created.");
  }

  if (res.status === 404) {
    throw new Error("Event not found.");
  }

  if (!res.ok) {
    throw new Error(`Failed to update event. Status: ${res.status}`);
  }
}

async function deleteEvent(token: string, id: string): Promise<void> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is missing");
  }

  const res = await fetch(`${serverUrl}/upcoming-events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized: Please sign in.");
  }

  if (res.status === 403) {
    throw new Error("You can only delete events you created.");
  }

  if (res.status === 404) {
    throw new Error("Event not found.");
  }

  if (!res.ok) {
    throw new Error(`Failed to delete event. Status: ${res.status}`);
  }
}

export default function ManageEventsPage() {
  const { joined } = useAuth();
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [saveLoading, setSaveLoading] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
  

    const fetchMyEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = await getTokenFromClient();
        const data = await getMyEvents(token);

        if (mounted) {
          setEvents(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load events.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const openEdit = (event: ManagedEvent) => {
    setEditForm({
      title: event.title,
      description: event.description,
      category: event.category,
      city: event.city || "",
      venue: event.venue || "",
      address: event.address || "",
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      locationType: event.locationType,
      registrationDeadline: event.registrationDeadline,
      registrationLimit: String(event.registrationLimit || ""),
      requiredSkills: (event.requiredSkills || []).join(", "),
      responsibilities: event.responsibilities || "",
      volunteerCapacity: String(event.volunteerCapacity),
    });
    setEditingId(event._id);
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editingId) return;

    setSaveLoading(editingId);

    try {
      const token = await getTokenFromClient();

      const updateData: Record<string, unknown> = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        city: editForm.city,
        venue: editForm.venue,
        address: editForm.address,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        locationType: editForm.locationType,
        registrationDeadline: editForm.registrationDeadline,
        volunteerCapacity: parseInt(editForm.volunteerCapacity, 10),
      };

      if (editForm.registrationLimit.trim()) {
        updateData.registrationLimit = parseInt(
          editForm.registrationLimit,
          10
        );
      }

      if (editForm.requiredSkills.trim()) {
        updateData.requiredSkills = editForm.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (editForm.responsibilities.trim()) {
        updateData.responsibilities = editForm.responsibilities;
      }

      await updateEvent(token, editingId, updateData);

      const token2 = await getTokenFromClient();
      const updated = await getMyEvents(token2);
      setEvents(updated);

      closeEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event.");
    } finally {
      setSaveLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const token = await getTokenFromClient();
      await deleteEvent(token, id);

      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-[#245C45]/30 border-t-[#245C45] animate-spin" />
          <p className="text-sm text-slate-500">Loading your events...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <AlertCircle size={32} className="mx-auto mb-4 text-red-500" />
            <p className="text-sm font-semibold text-slate-500 mb-6">
              {error}
            </p>
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft size={16} />
              Browse Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/upcoming-events"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
            >
              <ArrowLeft size={18} />
              Back to Events
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Events
            </h1>
            <p className="mt-2 text-slate-500">
              Manage events you have created. You can edit or delete any event
              below.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <Plus size={16} />
            Create New Event
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {events.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CalendarDays size={40} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
              No Events Created Yet
            </h2>
            <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-slate-500">
              You haven&rsquo;t created any events yet. Get started by creating
              your first volunteering event.
            </p>
            <Link
              href="/create-event"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Plus size={16} />
              Create Event
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <span className="inline-block mb-3 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
                  Created by You
                </span>

                <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-200 mb-4">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <CalendarDays size={24} />
                    </div>
                  )}
                </div>

                <span className="inline-block mb-2 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
                  {event.category}
                </span>

                <h3 className="mb-1 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {event.title}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-emerald-500" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" />
                    <span>{event.startTime} – {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" />
                    <span>
                      {event.city || event.venue || "Location not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-emerald-500" />
                    <span>{event.volunteerCapacity} volunteers needed</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <button
                    onClick={() => openEdit(event)}
                    disabled={editingId === event._id || saveLoading === event._id}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#245C45]/30 px-4 py-2.5 text-sm font-semibold text-[#245C45] transition hover:bg-[#E8F0E8] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId === event._id ? (
                      <>
                        <Edit size={16} className="animate-spin" />
                        Editing...
                      </>
                    ) : (
                      <>
                        <Edit size={16} />
                        Edit
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    disabled={deletingId === event._id}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === event._id ? (
                      <>
                        <Trash2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}