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
    href: "/join-event",
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
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Account";

  // Close all menus
  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await signOut();

      closeMenus();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Active route detection
  const isActiveRoute = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    closeMenus();
  }, [pathname]);

  // Close menus with Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Navigation link
  const NavLink = ({
    item,
    mobile = false,
  }: {
    item: (typeof navigation)[number] | (typeof userNavigation)[number];
    mobile?: boolean;
  }) => {
    const active = isActiveRoute(item.href);

    return (
      <Link
        href={item.href}
        onClick={closeMenus}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl font-semibold transition-all duration-200",
          mobile
            ? "px-4 py-3.5 text-sm"
            : "gap-2 rounded-full px-3 xl:px-4 py-2.5 text-sm",
          active
            ? "bg-[#E8F0E8] text-[#245C45]"
            : "text-[#202B25] hover:bg-[#F0F4EF] hover:text-[#245C45]",
        )}
      >
        <item.icon
          className={cn(
            "shrink-0 transition-transform duration-200 group-hover:scale-110",
            mobile ? "h-5 w-5" : "h-4 w-4",
          )}
        />

        <span className="whitespace-nowrap">{item.label}</span>
      </Link>
    );
  };

  // User Avatar
  const UserAvatar = ({ size = "normal" }: { size?: "normal" | "small" }) => {
    const dimensions =
      size === "small" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";

    return session?.user?.image ? (
      <Image
        src={session.user.image}
        alt="User profile"
        width={44}
        height={44}
        className={cn(
          dimensions,
          "shrink-0 rounded-full border border-[#E8F0E8] object-cover",
        )}
      />
    ) : (
      <div
        className={cn(
          dimensions,
          "flex shrink-0 items-center justify-center rounded-full bg-[#245C45] font-bold text-white",
        )}
      >
        {userName.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8F0E8] bg-[#FAF9F5]/95 shadow-sm backdrop-blur-xl">
      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-5 md:h-[68px] md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          aria-label="Kindora Home"
          className="flex min-w-0 shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Kindora Logo"
            width={160}
            height={48}
            priority
            className="h-8 w-auto object-contain sm:h-9 lg:h-10"
          />
        </Link>

        {/* Desktop Navigation - Large screens */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-[#E8F0E8] bg-white p-1 shadow-sm lg:flex"
        >
          {navigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center lg:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 xl:gap-3">
              {/* Profile Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                  className={cn(
                    "flex max-w-[190px] items-center gap-2 rounded-full border p-1.5 pr-2.5 transition-all duration-200 xl:max-w-[220px] xl:pr-3",
                    dropdownOpen
                      ? "border-[#245C45] bg-[#E8F0E8]"
                      : "border-[#E8F0E8] bg-white hover:border-[#245C45]/30 hover:bg-[#F0F4EF]",
                  )}
                >
                  <UserAvatar size="small" />

                  <span className="max-w-20 truncate text-sm font-semibold text-[#202B25] xl:max-w-28">
                    {userName}
                  </span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#78847B] transition-transform duration-200",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-3 w-[min(16rem,calc(100vw-1.5rem))] origin-top-right animate-in fade-in slide-in-from-top-2 rounded-2xl border border-[#E8F0E8] bg-white p-2 shadow-xl duration-200"
                  >
                    {/* User Information */}
                    <div className="border-b border-[#E8F0E8] px-3 py-3">
                      <p className="truncate text-sm font-bold text-[#202B25]">
                        {userName}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#78847B]">
                        {session.user.email}
                      </p>
                    </div>

                    {/* User Navigation */}
                    <div className="space-y-1 py-2">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenus}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            isActiveRoute(item.href)
                              ? "bg-[#E8F0E8] text-[#245C45]"
                              : "text-[#202B25] hover:bg-[#F0F4EF] hover:text-[#245C45]",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Separate Logout Button */}
              <Button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-10 rounded-full bg-red-600 px-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 xl:px-5"
              >
                <LogOut className="mr-1.5 h-4 w-4 xl:mr-2" />

                <span className="hidden xl:inline">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>

                <span className="xl:hidden">
                  {isLoggingOut ? "..." : "Logout"}
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 xl:gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-[#245C45]/30 px-4 text-[#245C45] transition-all hover:bg-[#E8F0E8] xl:px-5"
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="h-10 rounded-full bg-[#245C45] px-4 text-white shadow-sm transition-all hover:bg-[#194936] hover:shadow-md xl:px-5">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Menu Toggle */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#245C45] transition-all hover:bg-[#E8F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C45] lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile & Tablet Navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        className={cn(
          "absolute left-0 right-0 top-full z-40 overflow-hidden border-b border-[#E8F0E8] bg-[#FAF9F5] shadow-xl transition-all duration-300 ease-in-out lg:hidden",
          mobileMenuOpen
            ? "visible max-h-[calc(100dvh-64px)] opacity-100 md:max-h-[calc(100dvh-68px)]"
            : "invisible max-h-0 opacity-0",
        )}
      >
        <div className="max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 md:max-h-[calc(100dvh-68px)]">
          {/* Main Navigation */}
          <div>
            <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#78847B]">
              Navigation
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.href} item={item} mobile />
              ))}
            </nav>
          </div>

          {/* Authenticated User */}
          {isAuthenticated ? (
            <div className="mt-5 border-t border-[#E8F0E8] pt-5">
              {/* User Information */}
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#E8F0E8] bg-white p-3">
                <UserAvatar />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#202B25]">
                    {userName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#78847B]">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Account Navigation */}
              <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#78847B]">
                My Account
              </p>

              <nav className="space-y-1">
                {userNavigation.map((item) => (
                  <NavLink key={item.href} item={item} mobile />
                ))}
              </nav>

              {/* Mobile Logout */}
              <div className="mt-5 border-t border-[#E8F0E8] pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="h-12 w-full rounded-xl border-red-200 font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />

                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          ) : (
            /* Guest Actions */
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E8F0E8] pt-5">
              <Link href="/login" onClick={closeMenus} className="w-full">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl border-[#245C45]/30 font-semibold text-[#245C45] hover:bg-[#E8F0E8]"
                >
                  <FiLogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>

              <Link href="/signup" onClick={closeMenus} className="w-full">
                <Button className="h-12 w-full rounded-xl bg-[#245C45] font-semibold text-white hover:bg-[#194936]">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
