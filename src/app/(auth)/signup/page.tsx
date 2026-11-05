"use client";

import {
  ArrowRight,
  Camera,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

import { signIn, signUp } from "@/lib/auth-client";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export default function SignupPage() {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setError(null);

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || isGoogleLoading) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    const imageFile = formData.get("image");

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      let imageUrl: string | undefined;

      if (imageFile instanceof File && imageFile.size > 0) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const { error: signupError } = await signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        callbackURL: "/",
      });

      if (signupError) {
        throw new Error(signupError.message || "Account creation failed.");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupWithGoogle = async () => {
    if (isLoading || isGoogleLoading) return;

    setIsGoogleLoading(true);
    setError(null);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google signup failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition-all duration-200 placeholder:text-[#A1AAA2] hover:border-[#B8CDBB] focus:border-[#245C45] focus:bg-white focus:ring-4 focus:ring-[#245C45]/10 disabled:opacity-60";

  return (
    <main className="min-h-screen bg-[#FAF9F5] dark:bg-background px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Signup Form */}
        <section className="mx-auto w-full max-w-lg">
          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE8DC] dark:border-border bg-[#E8F0E8] dark:bg-muted px-4 py-2 text-xs font-bold tracking-wide text-[#245C45] dark:text-green-400">
              <Heart size={15} />
              JOIN THE KINDORA COMMUNITY
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#202B25] dark:text-foreground sm:text-4xl lg:text-5xl">
              Create your <span className="text-[#245C45] dark:text-green-400">account.</span>
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#78847B] dark:text-muted-foreground sm:text-base lg:mx-0">
              Be part of something meaningful. Start making a difference in your
              community today.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#E8EDE7] dark:border-border bg-white dark:bg-card p-5 shadow-[0_20px_60px_rgba(36,92,69,0.07)] sm:p-8">
            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3 pb-3">
                <label
                  htmlFor="image"
                  className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#B8CDBB] dark:border-border bg-[#E8F0E8] dark:bg-muted transition-all duration-300 hover:scale-105 hover:border-[#245C45] dark:hover:border-green-500 hover:shadow-lg"
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
                    <div className="flex flex-col items-center text-[#245C45] dark:text-green-400">
                      <Camera size={26} />
                      <span className="mt-1 text-[10px] font-bold text-[#245C45] dark:text-green-400">UPLOAD</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-[#245C45]/50 dark:bg-green-500/50 text-white opacity-0 transition group-hover:opacity-100">
                    <Camera size={23} />
                  </div>

                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={isLoading || isGoogleLoading}
                  />
                </label>

                <div className="text-center">
                  <p className="text-sm font-bold text-[#202B25]">
                    Profile Picture
                  </p>
                  <p className="mt-1 text-xs text-[#9AA39B]">
                    Optional · JPG, PNG or WEBP · Max 2MB
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-[#202B25]"
                >
                  Your Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA39B]"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    disabled={isLoading || isGoogleLoading}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#202B25]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA39B]"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    disabled={isLoading || isGoogleLoading}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#202B25]"
                >
                  Create Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA39B]"
                  />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    disabled={isLoading || isGoogleLoading}
                    placeholder="Create a password"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-semibold text-[#202B25]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA39B]"
                  />

                  <input
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    required
                    minLength={6}
                    disabled={isLoading || isGoogleLoading}
                    placeholder="Re-enter your password"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#245C45] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#245C45]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#194833] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#245C45]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8EDE7]" />
              <span className="text-xs font-medium text-[#9AA39B]">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-[#E8EDE7]" />
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleSignupWithGoogle}
              disabled={isLoading || isGoogleLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E2E9E1] bg-white text-sm font-semibold text-[#354139] transition-all hover:border-[#B8CDBB] hover:bg-[#FAFBF9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                  aria-label="Google"
                >
                  <title>Google</title>
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.01 13.22l7.98 6.19C12.88 13.72 17.98 9.5 24 9.5Z"
                    transform="translate(0 4)"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.19 5.59c4.2-3.88 6.57-9.59 6.57-17.24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.99 28.59A14.4 14.4 0 0 1 10.22 24c0-1.59.27-3.12.77-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 3.01 10.78l7.98-6.19Z"
                    transform="translate(1 0)"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.14 15.91-5.81l-7.19-5.59c-1.99 1.34-4.52 2.14-8.72 2.14-6.02 0-11.12-4.22-13.01-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}
              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-[#78847B]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#245C45] transition hover:text-[#E8A45B]"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#9AA39B]">
            <ShieldCheck size={15} />
            Your information is safe and secure.
          </div>
        </section>

        {/* Illustration */}
        <section className="relative hidden flex-col items-center lg:flex">
          <div className="relative w-full max-w-[520px]">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#E8A45B]/15 blur-3xl" />
            <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-[#245C45]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#E8EDE7] bg-[#E8F0E8] p-6 shadow-[0_20px_60px_rgba(36,92,69,0.08)]">
              <Image
                src="/signup_img/signup.png"
                alt="People working together to make a positive impact"
                width={600}
                height={600}
                priority
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border border-[#E8EDE7] bg-white p-4 shadow-xl sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0E8] text-[#245C45]">
                <Heart size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#202B25]">
                  Spread Kindness
                </p>
                <p className="text-xs text-[#9AA39B]">
                  Make every action count.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-md text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-[#245C45]">
              Small Actions.
              <br />
              Greater Impact.
            </h2>

            <p className="mt-4 text-base leading-7 text-[#78847B]">
              Every small act of kindness can create meaningful change. Connect,
              volunteer, and grow together with Kindora.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
