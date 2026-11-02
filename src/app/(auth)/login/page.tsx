
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { signIn } from "@/lib/auth-client";

export default function LogPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = isLoading || isGoogleLoading;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const { error: loginError } = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (loginError) {
        throw new Error(
          loginError.message || "Invalid email or password.",
        );
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Login Error:", err);

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
    if (isSubmitting) return;

    setIsGoogleLoading(true);
    setError(null);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google Login Error:", err);

      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Login Form */}
        <section className="mx-auto w-full max-w-lg">

          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE9DC] bg-[#E8F0E8] px-4 py-2 text-sm font-semibold text-[#245C45]">
              <Heart size={16} className="fill-[#245C45]" />
              Welcome to Kindora
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#202B25] sm:text-4xl lg:text-5xl">
              Welcome{" "}
              <span className="text-[#245C45]">back!</span>
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#78847B] sm:text-base lg:mx-0">
              Sign in to continue your journey of kindness.
              Your community is waiting for you.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#E8EDE7] bg-white p-5 shadow-[0_15px_50px_rgba(36,92,69,0.07)] sm:p-8">

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5"
            >
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
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition-all duration-200 placeholder:text-[#A1AAA2] hover:border-[#B8CDBB] focus:border-[#245C45] focus:bg-white focus:ring-4 focus:ring-[#245C45]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-[#202B25]"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#245C45] transition-colors hover:text-[#E8A45B]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-12 text-sm text-[#202B25] outline-none transition-all duration-200 placeholder:text-[#A1AAA2] hover:border-[#B8CDBB] focus:border-[#245C45] focus:bg-white focus:ring-4 focus:ring-[#245C45]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isSubmitting}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78847B] transition-colors hover:text-[#245C45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C45] disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
                >
                  <span className="mt-0.5 font-bold">!</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-1 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#245C45] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#245C45]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#194833] hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#245C45]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8EDE7]" />

              <span className="shrink-0 text-xs font-medium tracking-wide text-[#9AA39B]">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-[#E8EDE7]" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleSignupWithGoogle}
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E2E9E1] bg-white text-sm font-semibold text-[#354139] transition-all duration-200 hover:border-[#B8CDBB] hover:bg-[#FAFBF9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#245C45]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 48 48"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
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

            {/* Signup Link */}
            <p className="mt-6 text-center text-sm text-[#78847B]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#245C45] transition-colors hover:text-[#E8A45B]"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>

        {/* Illustration */}
        <section className="relative hidden flex-col items-center lg:flex">
          <div className="relative w-full max-w-[520px]">

            {/* Decorative Background */}
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#E8A45B]/15 blur-2xl" />

            <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-[#245C45]/10 blur-2xl" />

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#E8EDE7] bg-[#E8F0E8] p-6 shadow-[0_20px_60px_rgba(36,92,69,0.08)]">
              <Image
                src="/login_img/login.png"
                alt="People working together to make a positive impact"
                width={600}
                height={600}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* Illustration Content */}
          <div className="mt-8 max-w-md text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-[#245C45]">
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
