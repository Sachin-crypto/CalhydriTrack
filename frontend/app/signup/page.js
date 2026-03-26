"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await api.post("/auth/signup", { email, password });
      router.push("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-white px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-gray-900">Create account</h1>
        <p className="mb-5 text-sm text-gray-500">Start tracking your daily calories and water.</p>
        <div className="space-y-3">
        <input
          placeholder="Email"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}