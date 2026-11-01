"use client";

import { Calendar, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  console.log(session);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!session?.user;

  const userName =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Account";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          // router.push("/login"); // redirect to login page
        },
      },
    });
    await signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
                    : "text-[#202B25] hover:bg-[#F5F7F2] hover:text-[#245C45]",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div>
          {session?.user ? (
            <div className="flex gap-4 items-center">
              <div>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={"user_image"}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-green-950 object-cover"
                  />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2"
              >
                log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href={"/login"}>
                <button className="bg-amber-400 px-6 py-2">login</button>
              </Link>
              <Link href={"/signup"}>
                <button className="bg-amber-400 px-6 py-2">Sign up</button>
              </Link>
            </div>
          )}
          <div></div>
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
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#E8F0E8]">
            <h2 className="text-sm font-semibold text-[#202B25]">Menu</h2>
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
            {/* Mobile Links */}
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
                        : "text-[#202B25] hover:bg-[#E8F0E8] hover:text-[#245C45]",
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
                <div className="space-y-3">
                  <p className="truncate px-3 text-sm font-semibold text-[#202B25]">
                    {userName}
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-[#245C45] text-[#245C45] hover:bg-[#E8F0E8]"
                  >
                    <LogOut className="mr-2 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button className="w-full bg-[#245C45] font-bold text-white hover:bg-[#194936]">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <FiLogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
