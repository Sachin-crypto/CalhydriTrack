"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [caloriesGoal, setCaloriesGoal] = useState("");
  const [waterGoal, setWaterGoal] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Fetch user data
  const fetchUser = async () => {
    try {
      const res = await api.get("/goals");
      setUser(res.data.profile);
      setCaloriesGoal(res.data.goals?.calories ?? "");
      setWaterGoal(res.data.goals?.water ?? "");
      setHeightCm(res.data.profile?.heightCm ?? "");
      setWeightKg(res.data.profile?.weightKg ?? "");
      setAge(res.data.profile?.age ?? "");
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }
      console.error(err);
    }
  };

  // Update goals
  const updateGoals = async () => {
    try {
      setSaving(true);
      await api.post("/goals", {
        calories: Number(caloriesGoal || 0),
        water: Number(waterGoal || 0),
        age: age === "" ? null : Number(age),
        heightCm: heightCm === "" ? null : Number(heightCm),
        weightKg: weightKg === "" ? null : Number(weightKg),
      });
      alert("Goals updated!");
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }
      alert(err?.response?.data?.message || "Failed to update goals");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl space-y-6 px-5 py-8">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-gray-900">Profile</h2>

          {user ? (
            <>
              <p className="text-sm text-gray-600">
                Signed in as <span className="font-medium text-gray-900">{user.email}</span>
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Loading profile...</p>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile & Daily Goals</h2>
          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
              placeholder="Height (cm)"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              type="number"
              min="0"
            />

            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
              placeholder="Weight (kg)"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              type="number"
              min="0"
            />

            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              min="0"
            />

          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
            placeholder="Calories goal"
            value={caloriesGoal}
            onChange={(e) => setCaloriesGoal(e.target.value)}
            type="number"
            min="0"
          />

          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
            placeholder="Water goal (ml)"
            value={waterGoal}
            onChange={(e) => setWaterGoal(e.target.value)}
            type="number"
            min="0"
          />

          <button
            onClick={updateGoals}
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Goals"}
          </button>
          </div>
        </section>
      </main>
    </div>
  );
}