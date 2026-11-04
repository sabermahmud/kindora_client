
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTrash,
} from "react-icons/fa";

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

interface ManageEventCardProps {
  event: EventDataType;
  onDelete?: (eventId: string) => Promise<void> | void;
}

export function ManageEventCard({
  event,
  onDelete,
}: ManageEventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(event.startDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await onDelete?.(event._id);
      
    } catch (error) {
      console.error("Failed to delete event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group relative w-full overflow-hidden pt-0 transition-shadow duration-300 hover:shadow-lg">

      {/* Event Cover Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute right-4 top-4">
          <Badge variant="secondary" className="capitalize">
            {event.category}
          </Badge>
        </div>
      </div>

      {/* Event Information */}
      <CardHeader className="gap-3">
        <CardTitle className="line-clamp-1 text-xl">
          {event.title}
        </CardTitle>

        <CardDescription className="line-clamp-3 min-h-[60px]">
          {event.description}
        </CardDescription>
      </CardHeader>

      {/* Event Details */}
      <div className="space-y-3 px-6 text-sm text-muted-foreground">

        {/* Date */}
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="shrink-0 text-[#245C45]" />
          <span>
            {formattedDate} at {event.startTime}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="shrink-0 text-[#245C45]" />
          <span className="line-clamp-1">
            {event.venue}, {event.city}
          </span>
        </div>

        {/* Registration Capacity */}
        <div className="flex items-center gap-3">
          <FaUsers className="shrink-0 text-[#245C45]" />
          <span>
            Registration Limit: {event.registrationLimit}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <CardFooter className="mt-2 flex gap-3">

        {/* Update Button */}
        <Button
          className="group/button flex-1 bg-[#245C45] py-5 text-white hover:bg-[#194936]"
        >
          <Link href={`/manage-events/${event._id}/edit`} className="flex items-center gap-4">
            Update
            <FaArrowRight className="h-4 w-4 transition-transform duration-800 group-hover/button:translate-x-10" />
          </Link>
        </Button>

        {/* Delete Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger >
            <Button
              variant="destructive"
              className="flex-1 py-5"
              disabled={isDeleting}
            >
              <FaTrash className="h-4 w-4" />
              Cancel
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Cancel this event?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to cancel "{event.title}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Keep Event
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting ? "Canceling..." : "Yes, Cancel"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardFooter>
    </Card>
  );
}
