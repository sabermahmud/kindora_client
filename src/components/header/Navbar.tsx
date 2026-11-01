
"use client";

import {
  Calendar,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Users,
  X,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiLogIn } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  {
    href: "/upcoming-events",
    label: "Upcoming Events",
    icon: Calendar,
  },
];

const userNavigation = [
  {
    href: "/create-event",
    label: "Create Event",
    icon: PlusCircle,
  },
  {
    href: "/manage-events",
    label: "Manage Events",
    icon: CalendarDays,
  },
  {
    href: "/joined-events",
    label: "Joined Events",
    icon: Users,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!session?.user;

  const userName =
    session?.user?.name ??
    session?.user?.email?.split("@")[0] ??
    "Account";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await signOut();

      setDropdownOpen(false);
      setMobileMenuOpen(false);

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8F0E8] bg-[#FAF9F5]/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo.png"
            alt="Kindora Logo"
            width={160}
            height={48}
            priority
            className="h-9 w-auto object-contain sm:h-10 lg:h-11"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 rounded-full bg-white p-1 shadow-sm ring-1 ring-[#E8F0E8] md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-[#E8F0E8] text-[#245C45]"
                    : "text-[#202B25] hover:bg-[#F5F7F2] hover:text-[#245C45]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center md:flex">
          {isAuthenticated ? (
            <div ref={dropdownRef} className="relative">

              {/* Profile Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-[#E8F0E8] bg-white p-1.5 pr-3 transition hover:bg-[#E8F0E8]"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-[#E8F0E8] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#245C45] font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="max-w-24 truncate text-sm font-semibold text-[#202B25]">
                  {userName}
                </span>

                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-[#78847B] transition-transform",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-[#E8F0E8] bg-white p-2 shadow-xl"
                >
                  {/* User Information */}
                  <div className="border-b border-[#E8F0E8] px-3 py-3">
                    <p className="truncate text-sm font-bold text-[#202B25]">
                      {userName}
                    </p>

                    <p className="truncate text-xs text-[#78847B]">
                      {session.user.email}
                    </p>
                  </div>

                  {/* User Navigation */}
                  <div className="space-y-1 py-2">
                    {userNavigation.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                            isActive
                              ? "bg-[#E8F0E8] text-[#245C45]"
                              : "text-[#202B25] hover:bg-[#E8F0E8] hover:text-[#245C45]"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#E8F0E8] pt-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>

              <Link href="/signup">
                <Button className="bg-[#245C45] text-white hover:bg-[#194936]">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#245C45] transition-colors hover:bg-[#E8F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C45] md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-40 flex flex-col bg-[#FAF9F5] md:hidden"
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-[#E8F0E8] px-4 py-4">
            <h2 className="text-sm font-semibold text-[#202B25]">
              Menu
            </h2>

            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
              className="rounded-lg p-2 text-[#245C45] transition-colors hover:bg-[#E8F0E8]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">

            {/* Mobile Main Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-[#E8F0E8] text-[#245C45]"
                        : "text-[#202B25] hover:bg-[#E8F0E8] hover:text-[#245C45]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="mt-6 border-t border-[#E8F0E8] pt-6">
              {isAuthenticated ? (
                <div className="space-y-4">

                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3 px-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-full border border-[#E8F0E8] object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#245C45] font-bold text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#202B25]">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-[#78847B]">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile User Navigation */}
                  <nav className="space-y-2">
                    {userNavigation.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                            isActive
                              ? "bg-[#E8F0E8] text-[#245C45]"
                              : "text-[#202B25] hover:bg-[#E8F0E8] hover:text-[#245C45]"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Logout */}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="w-full border-[#245C45] text-[#245C45]"
                    >
                      <FiLogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>

                  <Link href="/signup" onClick={closeMobileMenu}>
                    <Button className="w-full bg-[#245C45] font-bold text-white hover:bg-[#194936]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
