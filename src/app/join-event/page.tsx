"use client";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export interface JoinedEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  city?: string;
  venue?: string;
  coverImage?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  volunteerCapacity: number;
  locationType: string;
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

async function getJoinedEvents(token: string): Promise<JoinedEvent[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is missing");
  }

  const res = await fetch(`${serverUrl}/joined-events`, {
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
    throw new Error(`Failed to fetch joined events. Status: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data as JoinedEvent[];
}

export default function JoinEventPage() {
  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchJoinedEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = await getTokenFromClient();
        const data = await getJoinedEvents(token);

        if (mounted) {
          setEvents(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load events.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchJoinedEvents();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-[#245C45]/30 border-t-[#245C45] animate-spin" />
          <p className="text-sm text-slate-500">
            Loading your joined events...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-semibold text-slate-500 mb-6">{error}</p>
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

  if (events.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link
              href="/upcoming-events"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
            >
              <ArrowLeft size={18} />
              Back to Events
            </Link>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center sm:p-24">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Users size={32} />
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
                No Joined Events Yet
              </h2>
              <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-slate-500">
                You haven&rsquo;t joined any events yet. Browse upcoming events
                and join the ones that interest you.
              </p>
              <Link
                href="/upcoming-events"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <ArrowLeft size={16} />
                Browse Events
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Joined Events
          </h1>
          <p className="mt-2 text-slate-500">
            You&rsquo;re signed up for {events.length} event
            {"s".repeat(events.length === 1 ? 0 : 1)}.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event._id}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-200 mb-4 group-hover:scale-[1.02] transition">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <CalendarDays size={24} />
                  </div>
                )}
              </div>

              <span className="inline-block mb-2 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
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
                  <span>
                    {event.startTime} – {event.endTime}
                  </span>
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
