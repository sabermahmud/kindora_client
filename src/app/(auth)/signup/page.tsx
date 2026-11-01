"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Heart,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle image preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setError(null);

    if (!file) {
      setImagePreview(null);
      return;
    }

    // Validate image type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    // Validate image size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables.",
      );
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary Error:", data);

      throw new Error(data.error?.message || "Image upload failed.");
    }

    if (!data.secure_url) {
      throw new Error("Cloudinary did not return an image URL.");
    }

    return data.secure_url;
  };

  // Handle signup
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    const imageFile = formData.get("image");

    try {
      // Validate password
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      // Upload profile image
      let imageUrl: string | undefined;

      if (imageFile instanceof File && imageFile.size > 0) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // Create user with Better Auth
      const { data, error: signupError } = await signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        callbackURL: "/",
      });

      if (signupError) {
        throw new Error(signupError.message || "Account creation failed.");
      }

      console.log("Signup successful:", data);

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Signup Error:", err);

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
    <main className="min-h-screen bg-[#FAF9F5] px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Signup Form */}
        <section className="mx-auto w-full max-w-lg">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E8F0E8] px-4 py-2 text-sm font-semibold text-[#245C45]">
              <Heart size={16} />
              Join the Kindora community
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#202B25] sm:text-4xl lg:text-5xl">
              Create your <span className="text-[#245C45]">account</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#78847B] sm:text-base">
              Be part of something meaningful. Start making a difference in your
              community today.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8EDE7] bg-white p-5 shadow-[0_15px_50px_rgba(36,92,69,0.07)] sm:p-8">
            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <label
                  htmlFor="image"
                  className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#B8CDBB] bg-[#E8F0E8] transition hover:border-[#245C45] hover:bg-[#DFEADF]"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-[#245C45]">
                      <Camera size={26} />
                      <span className="mt-1 text-[10px] font-semibold">
                        Upload
                      </span>
                    </div>
                  )}

                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>

                <div className="text-center">
                  <p className="text-sm font-bold text-[#202B25]">
                    Profile Picture
                  </p>
                  <p className="text-xs text-[#78847B]">
                    Choose a photo (optional, max 2MB)
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-bold text-[#202B25]"
                >
                  Your Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    disabled={isLoading}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition placeholder:text-[#A1AAA2] focus:border-[#245C45] focus:ring-4 focus:ring-[#245C45]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-[#202B25]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    disabled={isLoading}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition placeholder:text-[#A1AAA2] focus:border-[#245C45] focus:ring-4 focus:ring-[#245C45]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-[#202B25]"
                >
                  Create Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    disabled={isLoading}
                    placeholder="Create a password"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition placeholder:text-[#A1AAA2] focus:border-[#245C45] focus:ring-4 focus:ring-[#245C45]/10"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-bold text-[#202B25]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    required
                    minLength={6}
                    disabled={isLoading}
                    placeholder="Re-enter your password"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition placeholder:text-[#A1AAA2] focus:border-[#245C45] focus:ring-4 focus:ring-[#245C45]/10"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#245C45] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#245C45]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#194833] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#245C45]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating Account..." : "Create Account"}

                {!isLoading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#78847B]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#245C45] transition hover:text-[#E8A45B]"
              >
                Log in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-[#9AA39B]">
            By joining Kindora, you become part of a community that cares.
          </p>
        </section>

        {/* Illustration */}
        <section className="relative hidden lg:flex lg:flex-col lg:items-center">
          <div className="relative w-full max-w-130">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#E8A45B]/15 blur-2xl" />
            <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-[#245C45]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#E8F0E8] p-6">
              <Image
                src="/signup_img/signup.png"
                alt="People working together to make a positive impact"
                width={600}
                height={600}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <div className="mt-8 max-w-md text-center">
            <h2 className="text-3xl font-extrabold text-[#245C45]">
              Small Actions.
              <br />
              Greater Impact.
            </h2>

            <p className="mt-3 text-base leading-7 text-[#78847B]">
              Every small act of kindness can create a meaningful change.
              Connect, volunteer, and grow together with Kindora.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
