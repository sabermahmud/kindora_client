"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import Spinner from "../Spinner";
import { type EventDataType, ManageEventCard } from "./ManageEventCard";
import { FaCalendarAlt, FaPlus, FaRegCalendarCheck } from "react-icons/fa";

export default function ManagePage() {
  const { data: session, isPending } = useSession();

  const email = session?.user?.email;

  const [events, setEvents] = useState<EventDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getManageEventsData = useCallback(async () => {
    if (!email) return;

    try {
      setLoading(true);
      setError("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please sign in again.",
        );
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/manage-events/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const responseText = await res.text();

      let responseData: unknown;

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = responseText;
      }

      console.log("Manage Events API:", {
        status: res.status,
        ok: res.ok,
        response: responseData,
        hasToken: Boolean(token),
      });

      if (!res.ok) {
        const message =
          typeof responseData === "object" &&
          responseData !== null &&
          "message" in responseData &&
          typeof responseData.message === "string"
            ? responseData.message
            : `Request failed with status ${res.status}`;

        throw new Error(message);
      }

      if (!Array.isArray(responseData)) {
        throw new Error("Invalid API response: Expected an events array.");
      }

      setEvents(responseData as EventDataType[]);
    } catch (err) {
      console.error("Manage events error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setLoading(false);
      return;
    }

    getManageEventsData();
  }, [isPending, email, getManageEventsData]);

  if (isPending || loading) {
    return <Spinner />;
  }

  if (!email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-4 dark:bg-background">
        <div className="max-w-md rounded-2xl border border-[#E8E8DF] bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-card">
          <h2 className="text-xl font-bold text-[#183D30] dark:text-green-200">
            Authentication Required
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please sign in to manage your events.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#245C45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#194633] dark:bg-green-600 dark:hover:bg-green-700"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] dark:bg-background">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#245C45] dark:text-green-400">
              <FaCalendarAlt />
              <span>EVENT MANAGEMENT</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#183D30] dark:text-green-200 sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
              Organize, manage, and keep track of the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#245C45] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#194633] hover:shadow-md active:scale-[0.98] dark:bg-green-600 dark:hover:bg-green-700"
          >
            <FaPlus />
            Create Event
          </Link>
        </div>

        {/* Event Summary */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-[#E8E8DF] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-card sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#EAF2EC] text-xl text-[#245C45] dark:bg-green-900/20 dark:text-green-400">
              <FaRegCalendarCheck />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Your Events
              </p>

              <p className="mt-1 text-2xl font-bold text-[#183D30] dark:text-green-200">
                {events.length}
              </p>
            </div>
          </div>

          <span className="hidden rounded-full bg-[#EAF2EC] px-3 py-1.5 text-xs font-semibold text-[#245C45] dark:bg-green-900/20 dark:text-green-400 sm:inline-flex">
            My Events
          </span>
        </div>

        {/* Events Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#183D30] dark:text-green-200">
                Your Events
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                All events created by you
              </p>
            </div>

            <span className="rounded-lg border border-[#E8E8DF] bg-white px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-card dark:text-gray-400">
              {events.length} Events
            </span>
          </div>

          {/* Error State */}
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-800/30 dark:bg-red-900/20">
              <p className="font-semibold text-red-700 dark:text-red-400">
                Unable to load your events
              </p>

              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={getManageEventsData}
                className="mt-5 rounded-lg bg-[#245C45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194633] dark:bg-green-600 dark:hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event._id} className="min-w-0">
                  <ManageEventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#CCD8CE] bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-card">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#EAF2EC] text-2xl text-[#245C45] dark:bg-green-900/20 dark:text-green-400">
                <FaRegCalendarCheck />
              </div>

              <h3 className="text-xl font-bold text-[#183D30] dark:text-green-200">
                No events yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                You haven't created any events yet. Start something meaningful
                and bring your community together!
              </p>

              <Link
                href="/create-event"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#245C45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#194633] dark:bg-green-600 dark:hover:bg-green-700"
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
