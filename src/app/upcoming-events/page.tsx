import EventDetails from "@/components/EventDetails";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Event data type
interface Event {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  category: string;
  startDate: string;
  city?: string;
  venue?: string;
  volunteerCapacity: number;
}

// Validate event data
function isEvent(data: unknown): data is Event {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const event = data as Record<string, unknown>;

  return (
    typeof event._id === "string" &&
    typeof event.title === "string" &&
    typeof event.description === "string" &&
    typeof event.category === "string" &&
    typeof event.startDate === "string" &&
    typeof event.volunteerCapacity === "number" &&
    (event.coverImage === undefined || typeof event.coverImage === "string") &&
    (event.city === undefined || typeof event.city === "string") &&
    (event.venue === undefined || typeof event.venue === "string")
  );
}

// Validate image URL
function isValidImageUrl(url?: string): boolean {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}

// Fetch upcoming events
async function getUpcomingEvents(): Promise<Event[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL environment variable is missing");
  }
const token = await getTokenFromServer()
  const res = await fetch(`${serverUrl}/upcoming-events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    console.error("Upcoming events API error:", errorData);

    throw new Error(`Failed to fetch upcoming events. Status: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data) || !data.every(isEvent)) {
    throw new Error("Invalid upcoming events API response");
  }

  return data;
}

// Upcoming Events Page
export default async function UpcomingEventsPage() {
  const eventsData = await getUpcomingEvents();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Make a Difference
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Upcoming Events
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover meaningful opportunities, connect with your community,
              and make a positive impact through volunteering.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-sm text-slate-500">Available events</p>
            <p className="text-2xl font-bold text-slate-900">
              {eventsData.length}
            </p>
          </div>
        </div>

        {/* Events Grid */}
        {eventsData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventsData.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Cover Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  {isValidImageUrl(event.coverImage) ? (
                    <Image
                      src={event.coverImage!}
                      alt={event.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image available
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                    {event.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-bold text-slate-900 transition group-hover:text-emerald-700">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                    {event.description}
                  </p>

                  {/* Event Information */}
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    {/* Event Date */}
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </span>

                      <div>
                        <p className="text-xs text-slate-400">Event date</p>
                        <p className="font-medium text-slate-700">
                          {Number.isNaN(Date.parse(event.startDate))
                            ? "Date unavailable"
                            : new Date(event.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2" />
                        </svg>
                      </span>

                      <div>
                        <p className="text-xs text-slate-400">Location</p>
                        <p className="font-medium text-slate-700">
                          {event.city ||
                            event.venue ||
                            "Location not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Volunteer Capacity */}
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="10" cy="7" r="4" />
                          <path d="M20 8v6M23 11h-6" />
                        </svg>
                      </span>

                      <div>
                        <p className="text-xs text-slate-400">
                          Volunteer capacity
                        </p>
                        <p className="font-medium text-slate-700">
                          {event.volunteerCapacity} volunteers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <EventDetails event={event} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Events Available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are no events to display right now. Please check back later
              for new volunteering opportunities.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
