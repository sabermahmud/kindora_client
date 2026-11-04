import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

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
}

export function ManageEventCard({event}:ManageEventCardProps) {
  console.log(event)
  return (
    <Card className="relative w-full pt-0">
      <div className="absolute inset-0 z-30 bg-linear-to-b from-black/50  via-black/10 to-transparent hover:bg-transparent" />
      <Image src={event.coverImage} alt="coverImage" width={500} height={300} className="w-full min-h-full object-cover" />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{event.category}</Badge>
        </CardAction>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="line-clamp-4">
          {event.description}
        </CardDescription>
      </CardHeader>
      <div></div>
      <CardFooter>
        <Button className="group flex w-full items-center justify-center gap-2 bg-[#245C45] py-4 text-base font-medium text-white hover:bg-[#194936]">
          Update
          <FaArrowRight className="h-4 w-4 transition-transform duration-800 group-hover:translate-x-10" />
        </Button>
      </CardFooter>
    </Card>
  );
}
