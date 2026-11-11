"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

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

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { useSession } from "@/lib/auth-client";
import UpdateBtn from "@/components/UpdateBtn";

export interface EventDataType {
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
  createdBy: string;
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

interface ManageEventCardProps {
  event: EventDataType;
  onDelete?: (eventId: string) => Promise<void> | void;
}

export function ManageEventCard({ event, onDelete }: ManageEventCardProps) {
  const { data: session } = useSession();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });



  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = await getTokenFromClient();
      const email = session?.user?.email;

      if (!token || !email) {
        throw new Error("Please sign in again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/manage-events/${event._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            created_by: email,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete event.");
      }

      await onDelete?.(event._id);

      // Close dialog after successful deletion
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Delete Event Error:", error);
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

        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent" />

        <div className="absolute right-4 top-4">
          <Badge variant="secondary" className="capitalize">
            {event.category}
          </Badge>
        </div>
      </div>

      {/* Event Information */}
      <CardHeader className="gap-3">
        <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>

        <CardDescription className="line-clamp-3 min-h-15">
          {event.description}
        </CardDescription>
      </CardHeader>

      {/* Event Details */}
      <div className="space-y-3 px-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="shrink-0 text-[#245C45] dark:text-green-400" />
          <span>
            {formattedDate} at {event.startTime}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="shrink-0 text-[#245C45] dark:text-green-400" />
          <span className="line-clamp-1">
            {event.venue}, {event.city}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <FaUsers className="shrink-0 text-[#245C45] dark:text-green-400" />
          <span>Registration Limit: {event.registrationLimit}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <CardFooter className="mt-2 flex gap-3">
        {/* Update Button */}
        <UpdateBtn/>

        {/* Delete Confirmation */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger
            render={
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive py-5 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                disabled={isDeleting}
              />
            }
          >
            <FaTrash className="h-4 w-4" />
            Cancel
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this event?</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to cancel "{event.title}"? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Keep Event
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
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



