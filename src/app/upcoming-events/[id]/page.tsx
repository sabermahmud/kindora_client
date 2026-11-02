import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CalendarCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Globe,
  MapPinned,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  address: string;
  category: string;
  city: string;
  coverImage: string;
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

// Fetch upcoming events
async function getUpcomingEvents(): Promise<Event[]> {
  const serverUrl = process.env.SERVER_URL;

  if (!serverUrl) {
    throw new Error("SERVER_URL environment variable is missing");
  }

  const res = await fetch(`${serverUrl}/upcoming-events`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch upcoming events. Status: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid upcoming events API response");
  }

  return data as Event[];
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const eventsData = await getUpcomingEvents();
  const filteredData = await eventsData.filter((event) => event._id === id);

  console.log("filtered", filteredData);

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

        {filteredData.map((data) => (
          <div key={data._id} className="space-y-8">
            {/* Hero Section */}
            <div className="relative h-[280px] overflow-hidden rounded-3xl bg-slate-200 sm:h-[420px]">
              {data.coverImage && (
                <Image
                  src={data.coverImage}
                  alt={data.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <span className="absolute left-6 top-6 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                {data.category}
              </span>

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
                <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  Volunteer Opportunity
                </span>

                <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                  {data.title}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-sm text-white/90">
                  <MapPin size={17} />
                  {data.city || data.venue || "Location not specified"}
                </p>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Left Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Description */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900">
                    About This Event
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                    {data.description}
                  </p>
                </div>

                {/* Event Information */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-7 text-xl font-bold text-slate-900">
                    Event Information
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InfoItem
                      icon={<CalendarDays size={21} />}
                      label="Start Date"
                      value={new Date(data.startDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    />

                    <InfoItem
                      icon={<CalendarCheck size={21} />}
                      label="End Date"
                      value={new Date(data.endDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    />

                    <InfoItem
                      icon={<Clock size={21} />}
                      label="Start Time"
                      value={data.startTime}
                    />

                    <InfoItem
                      icon={<Clock size={21} />}
                      label="End Time"
                      value={data.endTime}
                    />

                    <InfoItem
                      icon={<MapPin size={21} />}
                      label="City"
                      value={data.city || "Not specified"}
                    />

                    <InfoItem
                      icon={<MapPinned size={21} />}
                      label="Venue"
                      value={data.venue || "Not specified"}
                    />

                    <InfoItem
                      icon={<Globe size={21} />}
                      label="Location Type"
                      value={data.locationType || "Not specified"}
                    />

                    <InfoItem
                      icon={<Users size={21} />}
                      label="Volunteer Capacity"
                      value={`${data.volunteerCapacity} volunteers`}
                    />
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <BriefcaseBusiness size={22} />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Volunteer Responsibilities
                    </h2>
                  </div>

                  <p className="whitespace-pre-line text-sm leading-8 text-slate-600">
                    {data.responsibilities ||
                      "Responsibilities will be announced soon."}
                  </p>
                </div>

                {/* Required Skills */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={22} />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Required Skills
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {data.requiredSkills?.length ? (
                      data.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm font-semibold capitalize text-emerald-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No specific skills required.
                      </p>
                    )}
                  </div>
                </div>

                {/* Full Address */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-slate-900">
                    <MapPin className="text-emerald-600" />
                    Event Location
                  </h2>

                  <p className="text-sm leading-7 text-slate-600">
                    {data.address || "Address not specified"}
                  </p>
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="space-y-6 lg:sticky lg:top-8">
                {/* Registration Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="bg-emerald-600 p-6 text-white">
                    <p className="text-sm font-medium text-emerald-100">
                      Join Our Community
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">Make an Impact!</h2>

                    <p className="mt-2 text-sm leading-6 text-emerald-50">
                      Be part of something meaningful and make a positive
                      difference.
                    </p>
                  </div>

                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          Volunteer Capacity
                        </p>

                        <p className="mt-1 text-3xl font-extrabold text-slate-900">
                          {data.volunteerCapacity}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Users size={25} />
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <InfoItem
                      icon={<Users size={21} />}
                      label="Registration Limit"
                      value={`${data.registrationLimit} people`}
                    />

                    <InfoItem
                      icon={<CalendarCheck size={21} />}
                      label="Registration Deadline"
                      value={new Date(
                        data.registrationDeadline,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    />

                    <Link
                      href={`/events/${data._id}/register`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                      Register as Volunteer
                      <span aria-hidden="true">→</span>
                    </Link>

                    <p className="text-center text-xs leading-5 text-slate-400">
                      Your contribution can make a real difference.
                    </p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                  <h3 className="font-bold text-slate-900">
                    Ready to make a difference?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Join other passionate volunteers and become part of
                    something bigger.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={17} />
                    Every contribution matters
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

// Reusable Information Component
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className="break-words text-sm font-semibold text-slate-800">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}
