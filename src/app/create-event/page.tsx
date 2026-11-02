"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, ImagePlus, Info, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export default function CreateEventPage() {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setError(null);
    setSuccess(null);

    if (!file) {
      setCoverImage(null);
      setImagePreview(null);
      return;
    }

    // Validate image type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      setCoverImage(null);
      setImagePreview(null);
      return;
    }

    // Validate image size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      e.target.value = "";
      setCoverImage(null);
      setImagePreview(null);
      return;
    }

    setCoverImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle event submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Upload cover image to Cloudinary
      let imageUrl = "";

      if (coverImage) {
        imageUrl = await uploadImageToCloudinary(coverImage);
      }

      // Prepare event data
      const eventData = {
        title: formData.get("title")?.toString().trim() ?? "",
        category: formData.get("category")?.toString() ?? "",
        description: formData.get("description")?.toString().trim() ?? "",

        coverImage: imageUrl,

        startDate: formData.get("startDate")?.toString() ?? "",
        endDate: formData.get("endDate")?.toString() ?? "",
        startTime: formData.get("startTime")?.toString() ?? "",
        endTime: formData.get("endTime")?.toString() ?? "",

        locationType: formData.get("locationType")?.toString() ?? "",
        venue: formData.get("venue")?.toString() ?? "",
        city: formData.get("city")?.toString() ?? "",
        address: formData.get("address")?.toString() ?? "",

        volunteerCapacity: Number(formData.get("volunteerCapacity")),

        registrationDeadline:
          formData.get("registrationDeadline")?.toString() ?? "",

        requiredSkills:
          formData
            .get("requiredSkills")
            ?.toString()
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean) ?? [],

        responsibilities:
          formData.get("responsibilities")?.toString().trim() ?? "",

        registrationLimit: formData.get("registrationLimit")
          ? Number(formData.get("registrationLimit"))
          : null,
      };

      // Send event data to Express server
      const response = await fetch(`${process.env.SERVER_URL}/create-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event.");
      }

      console.log("Event created successfully:", result);

      setSuccess("Your event has been created successfully!");

      // Reset form and image
      e.currentTarget.reset();
      setCoverImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Create event error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Header */}
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#78847B] transition hover:text-[#245C45]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8F0E8] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#245C45]">
              <CalendarDays size={14} />
              Organizer Dashboard
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#202B25] sm:text-4xl">
              Create New Event
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78847B] sm:text-base">
              Share your initiative with the Kindora community and inspire
              people to make a positive difference.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="space-y-6 rounded-2xl border border-[#E5E9E3] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-[#EEF0EC] pb-5">
              <div className="rounded-xl bg-[#E8F0E8] p-3 text-[#245C45]">
                <Info size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#202B25]">
                  Basic Information
                </h2>
                <p className="text-sm text-[#78847B]">
                  Tell the community about your initiative.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">EVENT TITLE *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Tree Plantation Campaign 2026"
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">CATEGORY *</Label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#245C45]/20"
              >
                <option value="" disabled>
                  Select an event category
                </option>
                <option value="environment">Environment</option>
                <option value="education">Education</option>
                <option value="charity">Charity</option>
                <option value="healthcare">Healthcare</option>
                <option value="community">Community</option>
                <option value="animal-welfare">Animal Welfare</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">DESCRIPTION *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event, its purpose, and the impact you want to create..."
                rows={5}
                required
                disabled={isLoading}
                className="resize-none"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <Label htmlFor="coverImage">COVER IMAGE</Label>

              <label
                htmlFor="coverImage"
                className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#DCE5DB] bg-[#FAFCF9] transition hover:border-[#245C45] hover:bg-[#F5F9F4]"
              >
                {imagePreview ? (
                  <div className="relative h-64 w-full">
                    <Image
                      src={imagePreview}
                      alt="Event cover preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    <span className="absolute bottom-3 right-3 rounded-md bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#245C45]">
                      Change image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center px-5 py-12 text-center">
                    <div className="mb-3 rounded-full bg-[#E8F0E8] p-4 text-[#245C45]">
                      <ImagePlus size={26} />
                    </div>

                    <p className="text-sm font-semibold text-[#245C45]">
                      Click to upload an image
                    </p>

                    <p className="mt-1 text-xs text-[#78847B]">
                      PNG, JPG or WEBP (Max 2MB)
                    </p>
                  </div>
                )}
              </label>

              <input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>
          </section>

          {/* Schedule & Location */}
          <section className="space-y-6 rounded-2xl border border-[#E5E9E3] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-[#EEF0EC] pb-5">
              <div className="rounded-xl bg-[#E8F0E8] p-3 text-[#245C45]">
                <CalendarDays size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#202B25]">
                  Schedule & Location
                </h2>
                <p className="text-sm text-[#78847B]">
                  Set the event schedule and where it will take place.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">START DATE *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">END DATE *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">START TIME *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">END TIME *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationType">EVENT TYPE *</Label>
              <select
                id="locationType"
                name="locationType"
                defaultValue="offline"
                required
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#245C45]/20"
              >
                <option value="offline">In-person Event</option>
                <option value="online">Online Event</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="venue">VENUE NAME</Label>
                <Input
                  id="venue"
                  name="venue"
                  placeholder="e.g. Central Community Park"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">CITY</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g. Dhaka"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">FULL ADDRESS</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter the complete event address"
                disabled={isLoading}
                className="h-11"
              />
            </div>
          </section>

          {/* Volunteer & Registration */}
          <section className="space-y-6 rounded-2xl border border-[#E5E9E3] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-[#EEF0EC] pb-5">
              <div className="rounded-xl bg-[#E8F0E8] p-3 text-[#245C45]">
                <Users size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#202B25]">
                  Volunteer & Registration
                </h2>
                <p className="text-sm text-[#78847B]">
                  Define volunteer requirements and registration settings.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="volunteerCapacity">REQUIRED VOLUNTEERS *</Label>
                <Input
                  id="volunteerCapacity"
                  name="volunteerCapacity"
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">
                  REGISTRATION DEADLINE *
                </Label>
                <Input
                  id="registrationDeadline"
                  name="registrationDeadline"
                  type="date"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredSkills">REQUIRED SKILLS</Label>
              <Input
                id="requiredSkills"
                name="requiredSkills"
                placeholder="e.g. Communication, Leadership, Teamwork"
                disabled={isLoading}
                className="h-11"
              />
              <p className="text-xs text-[#78847B]">
                Separate multiple skills with commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">
                VOLUNTEER RESPONSIBILITIES
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="Describe what volunteers will do during the event..."
                rows={4}
                disabled={isLoading}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationLimit">REGISTRATION LIMIT</Label>
              <Input
                id="registrationLimit"
                name="registrationLimit"
                type="number"
                min="1"
                placeholder="Maximum number of participants"
                disabled={isLoading}
                className="h-11"
              />
              <p className="text-xs text-[#78847B]">
                Leave empty if there is no separate registration limit.
              </p>
            </div>
          </section>

          {/* Feedback Messages */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E5E9E3] pt-6 sm:flex-row sm:justify-end">
            <Link href="/" className="sm:inline-flex">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="h-11 w-full border-[#DCE5DB] px-7 text-[#245C45] hover:bg-[#E8F0E8] sm:w-auto"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 bg-[#245C45] px-8 text-white hover:bg-[#1B4936] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
