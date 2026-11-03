import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";


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

export function EventCard({event}:EventDataType) {
  return (
    <Card className="relative w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <Image src={event.coverImage} alt="coverImage" width={500} height={200}/>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{event.category}</Badge>
        </CardAction>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="line-clamp-4">{event.description}</CardDescription>
      </CardHeader>
      <div>

      </div>
      <CardFooter>
        <Button className="w-full bg-[#245C45] font-semibold text-white hover:bg-[#194936]">View Event</Button>
      </CardFooter>
    </Card>
  )
}
