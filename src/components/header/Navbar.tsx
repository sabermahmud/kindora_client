"use client";

import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { signOut, useSession } from "@/lib/auth-client";

const navigation = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/upcoming-events", label: "Upcoming Events", icon: Calendar },
  { href: "/categories", label: "Categories", icon: ShieldCheck },
];

export default function Navbar() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Account";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/[0.8]">
      <div className="flex h-14 shrink-0 items-center justify-between px-4 lg:px-8">
        {/* App Logo / Name */}
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold tracking-tight transition-colors sm:gap-3 sm:px-3 hover:bg-accent hover:text-accent-foreground"
        >
          <Image
            src="/Kindora_Heartleaf_Logo.png"
            alt="Kindora Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span>Kindora</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="mr-2 h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions: Conditional Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <Menu>
              <MenuTrigger asChild>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-input bg-secondary px-3 py-1 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="User account"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{userName}</span>
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem className="text-sm font-medium">
                  {session?.user?.name}
                </MenuItem>
                <MenuItem className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  onClick={() => {
                    void signOut();
                  }}
                >
                  Log out
                </MenuItem>
              </MenuContent>
            </Menu>
          ) : (
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Log in
            </button>
          )}
          <button
            type="button"
            className="lg:hidden cursor-pointer p-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background border-l border-border lg:hidden">
          <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-border">
            <button
              type="button"
              className="cursor-pointer p-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            <nav className="space-y-0.5">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-4 border-t border-border">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-center w-full rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex cursor-pointer items-center justify-center w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
