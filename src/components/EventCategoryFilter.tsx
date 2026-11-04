"use client";

import { useState } from "react";
import { EventCard } from "@/app/upcoming-events/EventCard";

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

interface EventCategoryFilterProps {
  events: EventDataType[];
}

export default function EventCategoryFilter({
  events,
}: EventCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(events.map((event) => event.category.toLowerCase())),
  ];

  const filteredEvents =
    activeCategory === "all"
      ? events
      : events.filter(
          (event) => event.category.toLowerCase() === activeCategory,
        );

  const formatCategory = (category: string) => {
    if (category === "all") return "All Events";

    return category
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeCategory === category
                ? "border-[#245C45] bg-[#245C45] text-white shadow-md shadow-green-900/15"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#245C45] hover:text-[#245C45]"
            }`}
          >
            {formatCategory(category)}
            <span className="ml-2 opacity-75">
              {category === "all"
                ? events.length
                : events.filter(
                    (event) => event.category.toLowerCase() === category,
                  ).length}
            </span>
          </button>
        ))}
      </div>

      {/* Filtered Events */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h3 className="text-xl font-bold text-slate-800">No Events Found</h3>

          <p className="mt-2 text-sm text-slate-500">
            No events are currently available in this category.
          </p>

          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className="mt-5 rounded-lg bg-[#245C45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194936]"
          >
            View All Events
          </button>
        </div>
      )}
    </div>
  );
}
