import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import EventCategoryFilter from "@/components/EventCategoryFilter";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

export const getUpcomingEvents = async () => {
  const token = await getTokenFromServer();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/upcoming-events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Fetching upcoming events failed");
  }

  return res.json();
};

export default async function UpComingPage() {
  const upComingEventData = await getUpcomingEvents();

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-[#245C45]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[#245C45]">
                Discover & Participate
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Upcoming Events
            </h1>

            <p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore upcoming events, connect with people, and be part of
              something meaningful.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#245C45] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-green-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#194936] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C45] focus-visible:ring-offset-2"
          >
            <IoMdAdd className="text-xl" />
            Create Event
          </Link>
        </section>

        {/* Events Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Explore Events
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Find an event that matches your interests.
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-[#245C45]">
              {upComingEventData.length} Events
            </span>
          </div>

          {/* Category Filter + Event Grid */}
          {upComingEventData.length > 0 ? (
            <EventCategoryFilter events={upComingEventData} />
          ) : (
            <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <IoMdAdd className="text-3xl text-[#245C45]" />
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                No Upcoming Events
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                There are no upcoming events right now. Be the first to create
                an event and bring people together!
              </p>

              <Link
                href="/create-event"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#245C45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#194936]"
              >
                <IoMdAdd className="text-lg" />
                Create Your First Event
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
