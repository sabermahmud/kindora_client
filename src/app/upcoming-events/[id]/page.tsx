import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getTokenFromServer } from "@/lib/getTokenFromServer";
import JoinBtn from "@/components/joinBtn";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export interface PageProps {
  params: Promise<{ id: string }>;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  address: string;
  category: string;
  city: string;
  coverImage?: string;
  createdAt: string;
  endDate: string;
  endTime: string;
  locationType: string;
  registrationDeadline: string;
  registrationLimit: number;
  requiredSkills: string[];
  responsibilities: string;
  startDate: string;
  startTime: string;
  updatedAt: string;
  venue: string;
  volunteerCapacity: number;
}

// Safe date formatter that never throws on invalid dates
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Date not specified";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Date not specified";
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateString: string | undefined): string {
  if (!dateString) return "Date not specified";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Date not specified";
  return parsed.toLocaleDateString();
}

// Fetch a single event by ID (requires JWT)
async function getEventById(token: string, id: string): Promise<Event> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is missing");
  }

  const res = await fetch(`${serverUrl}/upcoming-events/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized: Please sign in to view this event.");
  }

  if (res.status === 404) {
    throw new Error("Event not found.");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch event. Status: ${res.status}`);
  }

  const data: unknown = await res.json();

  return data as Event;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // Get JWT token from server-side session
  const token = await getTokenFromServer();

  // Redirect to login if no valid session
  if (!token) {
    const loginUrl = new URL(
      "/login",
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    );
    loginUrl.searchParams.set("callbackUrl", `/upcoming-events/${id}`);
    redirect(loginUrl.toString());
  }

  let event: Event | null = null;
  let error: string | null = null;

  try {
    event = await getEventById(token, id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load event.";
    console.error("Event details error:", err);
  }

  // If event failed to load, show error state
  if (error || !event) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-semibold text-slate-500 mb-6">
              {error}
            </p>
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft size={16} />
              Back to Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/upcoming-events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        <div key={event._id} className="space-y-8">
          {/* Hero Section */}
          <div className="relative h-[280px] overflow-hidden rounded-3xl bg-slate-200 sm:h-[420px]">
            {event.coverImage && (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <span className="absolute left-6 top-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              {event.category}
            </span>
          </div>

          {/* Event Details */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {event.title}
              </h1>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-slate-500">
                      {event.startTime} – {event.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <p className="font-medium text-slate-900">
                    {event.city || event.venue || "Location not specified"}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <p className="font-medium text-slate-900">
                    {event.volunteerCapacity} volunteers needed
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Description
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Responsibilities */}
              {event.responsibilities && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">
                    Volunteer Responsibilities
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {event.responsibilities}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Event Info Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">
                  Event Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Clock size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Registration Deadline
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatShortDate(event.registrationDeadline)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Location Type
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {event.locationType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Users size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Volunteer Capacity
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {event.volunteerCapacity} volunteers
                      </p>
                    </div>
                  </div>

                  {event.registrationLimit && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">
                          Registration Limit
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {event.registrationLimit} participants
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Skills */}
              {event.requiredSkills && event.requiredSkills.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                <JoinBtn event={event}/>
              </div>
            </div>
          </div>

          
        </div>
      </section>
    </main>
  );
}
