import Link from "next/link";

interface Event {
  _id: string;
}

interface EventDetailsProps {
  event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <Link
      href={`/upcoming-events/${event._id}`}
      className="mt-6 flex items-center justify-center gap-2 rounded-xl border-2 border-transparent bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
    >
      Explore Event
      <span aria-hidden="true">→</span>
    </Link>
  );
}