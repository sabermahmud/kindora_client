
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import Spinner from "../Spinner";
import { type EventDataType, ManageEventCard } from "./ManageEventCard";
import {
  FaCalendarAlt,
  FaPlus,
  FaRegCalendarCheck,
} from "react-icons/fa";

export const getUpcomingEvents = async (): Promise<EventDataType[]> => {
  const token = await getTokenFromClient();

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

export default function ManagePage() {
  const { data: session, isPending } = useSession();

  const [filteredData, setFilteredData] = useState<EventDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const user = session?.user?.email;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setError(false);

        const allEventsData = await getUpcomingEvents();

        const filtered = allEventsData.filter(
          (event) => event.created_by === user,
        );

        setFilteredData(filtered);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user, isPending]);

  if (isPending || isLoading) {
    return <Spinner />;
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5]">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#245C45]">
              <FaCalendarAlt />
              <span>EVENT MANAGEMENT</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#183D30] sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Organize, manage, and keep track of the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#245C45] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#194633] hover:shadow-md active:scale-[0.98]"
          >
            <FaPlus />
            Create Event
          </Link>
        </div>

        {/* Event Summary */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-[#E8E8DF] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#EAF2EC] text-xl text-[#245C45]">
              <FaRegCalendarCheck />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Your Upcoming Events
              </p>
              <p className="mt-1 text-2xl font-bold text-[#183D30]">
                {filteredData.length}
              </p>
            </div>
          </div>

          <span className="hidden rounded-full bg-[#EAF2EC] px-3 py-1.5 text-xs font-semibold text-[#245C45] sm:inline-flex">
            My Events
          </span>
        </div>

        {/* Events Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#183D30]">
                Your Events
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                All events created by you
              </p>
            </div>

            <span className="rounded-lg border border-[#E8E8DF] bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
              {filteredData.length} Events
            </span>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <p className="font-semibold text-red-700">
                Unable to load your events
              </p>
              <p className="mt-2 text-sm text-red-600">
                Something went wrong. Please refresh the page and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-[#245C45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194633]"
              >
                Try Again
              </button>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((event) => (
                <div key={event._id} className="min-w-0">
                  <ManageEventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CCD8CE] bg-white px-5 py-16 text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#EAF2EC] text-2xl text-[#245C45]">
                <FaRegCalendarCheck />
              </div>

              <h3 className="text-xl font-bold text-[#183D30]">
                No events yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                You haven't created any upcoming events. Start something
                meaningful and bring your community together!
              </p>

              <Link
                href="/create-event"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#245C45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#194633]"
              >
                <FaPlus />
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
