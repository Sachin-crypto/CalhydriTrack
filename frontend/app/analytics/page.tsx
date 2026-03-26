"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Navbar from "../../components/Navbar";
import { api } from "../../lib/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

type Point = { date?: string; label?: string; calories: number; water: number };
type AnalyticsData = {
  daily: Point[];
  weekly: Point[];
  monthly: Point[];
  summary: {
    totalCalories: number;
    totalWater: number;
    avgCalories: number;
    avgWater: number;
    caloriesTrendPct: number;
    waterTrendPct: number;
  };
};

const rangeOptions = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" as const } },
  scales: { y: { beginAtZero: true, grid: { color: "#ecfdf5" } }, x: { grid: { display: false } } },
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/entries/analytics?days=${range}`);
        setData(res.data);
      } catch (err: any) {
        if (err?.response?.status === 401) router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range, router]);

  const dailyLine = useMemo(() => {
    const labels = (data?.daily || []).map((d) => d.date || "");
    return {
      labels,
      datasets: [
        {
          label: "Daily Calories",
          data: (data?.daily || []).map((d) => d.calories),
          borderColor: "#059669",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [data]);

  const waterLine = useMemo(() => {
    const labels = (data?.daily || []).map((d) => d.date || "");
    return {
      labels,
      datasets: [
        {
          label: "Daily Water (ml)",
          data: (data?.daily || []).map((d) => d.water),
          borderColor: "#0284c7",
          backgroundColor: "rgba(14, 165, 233, 0.15)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [data]);

  const weeklyBar = useMemo(() => {
    const labels = (data?.weekly || []).map((d) => d.label || "");
    return {
      labels,
      datasets: [
        { label: "Calories", data: (data?.weekly || []).map((d) => d.calories), backgroundColor: "#10b981" },
        { label: "Water (ml)", data: (data?.weekly || []).map((d) => d.water), backgroundColor: "#38bdf8" },
      ],
    };
  }, [data]);

  const monthlyBar = useMemo(() => {
    const labels = (data?.monthly || []).map((d) => d.label || "");
    return {
      labels,
      datasets: [
        { label: "Calories", data: (data?.monthly || []).map((d) => d.calories), backgroundColor: "#34d399" },
        { label: "Water (ml)", data: (data?.monthly || []).map((d) => d.water), backgroundColor: "#7dd3fc" },
      ],
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white transition-colors duration-200">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500">Track calorie and hydration history over time.</p>
          </div>
          <div className="flex rounded-xl border border-gray-200 bg-white p-1">
            {rangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  range === option.value ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-emerald-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading analytics...</p>
        ) : (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">Total Calories</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{data?.summary.totalCalories ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">Avg Calories / Day</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{data?.summary.avgCalories ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">Total Water (ml)</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{data?.summary.totalWater ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">Avg Water / Day</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{data?.summary.avgWater ?? 0}</p>
              </div>
            </section>

            <section className="mb-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Daily Calorie Intake</h2>
                  <p className="text-sm text-gray-500">Trend {data?.summary.caloriesTrendPct ?? 0}%</p>
                </div>
                <div className="h-72">
                  <Line data={dailyLine} options={chartDefaults} />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Daily Water Intake</h2>
                  <p className="text-sm text-gray-500">Trend {data?.summary.waterTrendPct ?? 0}%</p>
                </div>
                <div className="h-72">
                  <Line data={waterLine} options={chartDefaults} />
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h2 className="mb-3 font-semibold text-gray-900">Weekly Trends</h2>
                <div className="h-72">
                  <Bar data={weeklyBar} options={chartDefaults} />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h2 className="mb-3 font-semibold text-gray-900">Monthly Trends</h2>
                <div className="h-72">
                  <Bar data={monthlyBar} options={chartDefaults} />
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
