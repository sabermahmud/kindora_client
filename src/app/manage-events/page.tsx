"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import Spinner from "../Spinner";
import { ManageEventCard } from "./ManageEventCard";

interface Event {
  created_by: string;
  title: string;
  _id: string;
}

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const token = await getTokenFromClient();

  const res = await fetch("http://localhost:5000/upcoming-events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Fetching upcoming events failed");
  }

  return res.json();
};

export default function ManagePage() {
  const { data: session, isPending } = useSession();

  const [filteredData, setFilteredData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = session?.user?.email;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const allEventsData = await getUpcomingEvents();

        const filtered = allEventsData.filter(
          (event) => event.created_by === user,
        );

        setFilteredData(filtered);
      } catch (error) {
        console.error(error);
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
    <div>
      <h1>Manage Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full mx-auto">
        {filteredData.length > 0 ? (
          filteredData.map((event) => (
            <div key={event._id} >
              <ManageEventCard event={event}/>
            </div>
          ))
        ) : (
          <p>You haven't created any events yet.</p>
        )}
      </div>
    </div>
  );
}
