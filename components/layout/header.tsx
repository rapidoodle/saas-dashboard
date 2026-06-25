"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 border-b border-amazon-navy-light bg-amazon-navy-mid flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-white leading-tight">{title}</h1>
        {subtitle ? (
          <p className="text-xs text-gray-400">{subtitle}</p>
        ) : (
          <p className="text-xs text-gray-400">{dateStr}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Amazon marketplace badge */}
        <span className="hidden sm:flex items-center gap-1.5 bg-amazon-navy px-3 py-1.5 rounded-full border border-amazon-navy-light">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-300 font-medium">Live</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-gray-400 hover:text-white hover:bg-amazon-navy-light cursor-pointer"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </Button>
      </div>
    </header>
  );
}
