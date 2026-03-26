"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setIsAuthenticated(false);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-emerald-700">
          Calorie Tracker
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {!loading && isAuthenticated ? (
            <>
              <Link href="/" className="rounded-lg px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700">
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Profile
              </Link>
              <Link
                href="/analytics"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
              >
                Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}