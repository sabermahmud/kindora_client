"use client";

import { CheckCircle2, PlusCircle } from "lucide-react";
import { useContext, useState } from "react";

import { AuthContext } from "@/context/AuthProvider";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export interface JoinEvent {
  _id: string;
  title: string;
  volunteerCapacity?: number;
}

export interface JoinBtnProps {
  event: JoinEvent;
  className?: string;
}

export default function JoinBtn({ event, className }: JoinBtnProps) {
  const { joined, setJoined } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlreadyJoined = !!joined[event._id];

  const handleJoin = async () => {
    if (isLoading || isAlreadyJoined) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getTokenFromClient();
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      if (!serverUrl) {
        throw new Error("Server URL is not configured.");
      }

      const res = await fetch(
        `${serverUrl}/upcoming-events/${event._id}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status === 401) {
        throw new Error("Please sign in to join this event.");
      }

      if (res.status === 400) {
        const data = await res.json().catch(() => null);
        setJoined((prev: Record<string, boolean>) => ({
          ...prev,
          [event._id]: true,
        }));
        throw new Error(data?.message || "Already joined this event.");
      }

      if (!res.ok) {
        throw new Error("Failed to join event. Please try again.");
      }

      setJoined((prev: Record<string, boolean>) => ({
        ...prev,
        [event._id]: true,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join event.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAlreadyJoined) {
    return (
      <button
        type="button"
        className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#245C45]/30 bg-[#E8F0E8] px-4 py-2 text-sm font-semibold text-[#245C45] cursor-default ${className ?? ""}`}
        disabled
      >
        <CheckCircle2 size={16} />
        Joined
      </button>
    );
  }

  return (
    <>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        type="button"
        className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#245C45]/30 px-4 py-2 text-sm font-semibold text-[#245C45] transition hover:bg-[#E8F0E8] ${className ?? ""}`}
        onClick={handleJoin}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <PlusCircle size={16} className="animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <PlusCircle />
            Join Event
          </>
        )}
      </button>
    </>
  );
}
