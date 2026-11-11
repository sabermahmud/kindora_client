import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheckCircle,
  FaGlobe,
  FaMapMarkerAlt,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTokenFromServer } from "@/lib/getTokenFromServer";


export interface EventDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface EventDataType {
  _id: string;
  address: string;
  category: string;
  city: string;
  coverImage: string;
  createdAt: string;
  createdBy: string;
  created_by: string;
  description: string;
  endDate: string;
  endTime: string;
  locationType: "offline" | "online";
  registrationDeadline: string;
  registrationLimit: number;
  requiredSkills: string[];
  responsibilities: string;
  startDate: string;
  startTime: string;
  title: string;
  updatedAt: string;
  venue: string;
  volunteerCapacity: number;
}

const getUpcomingEvents = async (): Promise<EventDataType[]> => {
  const token = await getTokenFromServer();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/upcoming-events`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Fetching upcoming events failed");
  }

  return res.json();
};

const formatDate = (date: string) => {
  if (!date) return "Not specified";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (time: string) => {
  if (!time) return "Not specified";

  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { id } = await params;

  const events = await getUpcomingEvents();

  const event = events.find((item) => item._id === id);

  if (!event) {
    notFound();
  }

  const isOnline = event.locationType === "online";

  const isRegistrationClosed =
    new Date(`${event.registrationDeadline}T23:59:59`) < new Date();

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Navigation */}
        <Link
          href="/upcoming-events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <FaArrowLeft />
          Back to Events
        </Link>

        {/* Event Cover */}
        <div className="relative h-65 overflow-hidden rounded-2xl sm:h-95">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-5 text-white sm:p-8">
            <Badge className="mb-3 border-none bg-primary text-primary-foreground capitalize">
              {event.category}
            </Badge>

            <h1 className="max-w-3xl text-2xl font-bold sm:text-4xl">
              {event.title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-white/90">
              <FaMapMarkerAlt />
              {isOnline ? "Online Event" : `${event.city}, ${event.venue}`}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Event */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">About This Event</h2>

              <p className="leading-8 text-muted-foreground">
                {event.description}
              </p>
            </section>

            {/* Event Schedule */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  Event Schedule
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Start Date & Time
                  </p>

                  <p className="font-semibold">{formatDate(event.startDate)}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTime(event.startTime)}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    End Date & Time
                  </p>

                  <p className="font-semibold">{formatDate(event.endDate)}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTime(event.endTime)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isOnline ? (
                    <FaGlobe className="text-primary" />
                  ) : (
                    <FaMapMarkerAlt className="text-primary" />
                  )}
                  Event Location
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {isOnline ? (
                    <FaGlobe className="text-primary" />
                  ) : (
                    <FaMapMarkerAlt className="text-primary" />
                  )}

                  <span className="font-medium capitalize">
                    {event.locationType} Event
                  </span>
                </div>

                {!isOnline && (
                  <p className="text-sm text-muted-foreground">
                    {[event.venue, event.address, event.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">
                Volunteer Responsibilities
              </h2>

              <p className="leading-8 text-muted-foreground">
                {event.responsibilities}
              </p>
            </section>

            {/* Required Skills */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Required Skills</h2>

              <div className="flex flex-wrap gap-2">
                {event.requiredSkills?.length ? (
                  event.requiredSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-2 text-sm"
                    >
                      <FaCheckCircle className="mr-2 text-primary" />
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No specific skills required.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside>
            <Card className="sticky top-6 border-none shadow-md">
              <CardHeader>
                <CardTitle>Join This Event</CardTitle>

                <p className="text-sm text-muted-foreground">
                  Become a volunteer and make a difference!
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Volunteer Capacity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-xl text-primary" />
                    <span className="text-sm">Volunteer Capacity</span>
                  </div>

                  <span className="font-bold">{event.volunteerCapacity}</span>
                </div>

                {/* Registration Limit */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaUserFriends className="text-xl text-primary" />
                    <span className="text-sm">Registration Limit</span>
                  </div>

                  <span className="font-bold">
                    {event.registrationLimit || "No limit"}
                  </span>
                </div>

                {/* Registration Deadline */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FaCalendarCheck className="text-xl text-primary" />
                    <span className="text-sm">Deadline</span>
                  </div>

                  <span className="text-right text-sm font-semibold">
                    {formatDate(event.registrationDeadline)}
                  </span>
                </div>

                {/* Join Button */}
                <div>
                  <button className="bg-green-800 px-6 py-4 w-full text-white text-2xl font-bold rounded-xl hover:bg-green-900 transition-colors duration-300">
                    Join
                  </button>
                  {/* <JoinBtn/> */}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
