"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import EntryForm from "../components/EntryForm";
import SummaryCard from "../components/SummaryCard";
import { api } from "../lib/api";

type Meal = {
  id: number;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
  name: string;
  calories: number;
};

type DashboardData = {
  water: number;
  manualCalories: number;
  mealTotals: Record<string, number>;
  totalMealCalories: number;
  dailyCaloriesTotal: number;
  meals: {
    BREAKFAST: Meal[];
    LUNCH: Meal[];
    DINNER: Meal[];
    SNACKS: Meal[];
  };
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await api.get("/entries/today");
      setData(res.data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl space-y-6 px-5 py-8">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Track calories and water with a quick daily check-in.</p>
        </section>
        <EntryForm onSaved={fetchData} water={data?.water ?? 0} />
        <SummaryCard data={data} />
      </main>
    </div>
  );
}