import { EventCard } from "@/app/upcoming-events/EventCard";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";

export interface UpComingPageProps {}

export const getUpcomingEvents = async () => {
  const token = await getTokenFromServer();
  const res = await fetch("http://localhost:5000/upcoming-events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw Error("fetching response not ok");
  }
  return res.json();
};

export default async function UpComingPage() {
  const upComingEventData = await getUpcomingEvents();

  console.log(upComingEventData);
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-[#245C45] text-4xl  font-bold ">
            Up Coming Events
          </h2>
        </div>
        <div>
          <Link href={"/create-event"}>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#245C45] font-bold text-white hover:bg-[#194936] rounded-lg shadow-lg shadow-green-800/30"><IoMdAdd className="font-extrabold" /> Create Event</button>
          </Link>
        </div>
      </div>
      {/* main */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
        {upComingEventData.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
