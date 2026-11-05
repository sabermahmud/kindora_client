import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventDataType {
  _id: string;
  title: string;
  category: string;
  description: string;
  address: string;
  city: string;
  venue: string;
  coverImage: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  registrationDeadline: string;
  registrationLimit: number;
  volunteerCapacity: number;
  requiredSkills: string[];
  responsibilities: string;
  createdAt: string;
  updatedAt: string;
}

interface EventCardProps {
  event: EventDataType;
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(
    `2000-01-01T${event.startTime}`,
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card className="group w-full overflow-hidden border border-gray-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950">
      {/* Cover Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

        <Badge className="absolute left-4 top-4 border-0 bg-white/95 dark:bg-gray-950/95 px-3 py-1 text-xs font-semibold capitalize text-[#245C45] dark:text-green-400 shadow-sm hover:bg-white">
          {event.category}
        </Badge>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">
            Upcoming Event
          </p>
          <h3 className="mt-1 line-clamp-1 text-xl font-bold text-white">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <CardHeader className="gap-4 px-5 pt-5">
        {/* Event Information */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaCalendarAlt className="shrink-0 text-[#245C45] dark:text-green-400" />
            <span className="truncate">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaClock className="shrink-0 text-[#245C45] dark:text-green-400" />
            <span className="truncate">{formattedTime}</span>
          </div>

          <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FaMapMarkerAlt className="shrink-0 text-[#245C45] dark:text-green-400" />
            <span className="truncate">
              {event.venue || event.address}, {event.city}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <CardTitle className="text-base font-bold">
            About This Event
          </CardTitle>

          <CardDescription className="line-clamp-3 text-sm leading-6">
            {event.description}
          </CardDescription>
        </div>

        {/* Volunteer Capacity */}
        <div className="space-y-2 rounded-lg bg-[#245C45]/5 p-3 dark:bg-[#245C45]/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FaUsers className="text-[#245C45] dark:text-green-400" />
              Volunteer Capacity
            </div>

            <span className="text-sm font-bold text-[#245C45] dark:text-green-400">
              {event.volunteerCapacity}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Maximum volunteer capacity for this event
          </p>
        </div>

        {/* Required Skills */}
        {event.requiredSkills?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Required Skills</p>

            <div className="flex flex-wrap gap-2">
              {event.requiredSkills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="rounded-md px-2.5 py-1 text-xs font-medium capitalize"
                >
                  {skill}
                </Badge>
              ))}

              {event.requiredSkills.length > 3 && (
                <Badge variant="outline" className="rounded-md text-xs">
                  +{event.requiredSkills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      {/* Footer */}
      <CardFooter className="px-5 pb-5 pt-1">
        <Link href={`/upcoming-events/${event._id}`} className="w-full mt-4">
          <Button className="group/btn h-11 w-full bg-[#245C45] dark:bg-green-600 font-semibold text-white transition-colors hover:bg-[#194936] dark:hover:bg-green-700">
            View Details
            <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
