
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    try {
      const { data, error: loginError } = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (loginError) {
        throw new Error(
          loginError.message || "Invalid email or password.",
        );
      }

      console.log("Login successful:", data);

      router.push("/");
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

  return (
    <main className="min-h-screen bg-[#FAF9F5] px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Login Form */}
        <section className="mx-auto w-full max-w-lg">

          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E8F0E8] px-4 py-2 text-sm font-semibold text-[#245C45]">
              <Heart size={16} />
              Welcome to Kindora
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#202B25] sm:text-4xl lg:text-5xl">
              Welcome <span className="text-[#245C45]">back!</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#78847B] sm:text-base">
              Sign in to continue your journey of kindness.
              Your community is waiting for you.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#E8EDE7] bg-white p-5 shadow-[0_15px_50px_rgba(36,92,69,0.07)] sm:p-8">

            <form onSubmit={handleLogin} className="flex flex-col gap-5">

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
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-4 text-sm text-[#202B25] outline-none transition placeholder:text-[#A1AAA2] focus:border-[#245C45] focus:ring-4 focus:ring-[#245C45]/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-[#202B25]"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#245C45] transition hover:text-[#E8A45B]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78847B]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-[#E2E9E1] bg-[#FAFBF9] pl-11 pr-12 text-sm text-[#202B25] outline-none transition placeholder:text-[#A1AAA2] focus:border-[#245C45] focus:ring-4 focus:ring-[#245C45]/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78847B] transition hover:text-[#245C45]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
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
                className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#245C45] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#245C45]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#194833] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#245C45]/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <p className="mt-6 text-center text-sm text-[#78847B]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#245C45] transition hover:text-[#E8A45B]"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[#9AA39B]">
            Small Actions. Greater Impact. Make every moment meaningful.
          </p>
        </section>

        {/* Illustration */}
        <section className="relative hidden lg:flex lg:flex-col lg:items-center">
          <div className="relative w-full max-w-130">

            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#E8A45B]/15 blur-2xl" />

            <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-[#245C45]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#E8F0E8] p-6">
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
