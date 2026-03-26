"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];

export default function EntryForm({ onSaved, water }) {
  const [mealType, setMealType] = useState("BREAKFAST");
  const [foodName, setFoodName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [manualWater, setManualWater] = useState("");
  const [savingMeal, setSavingMeal] = useState(false);
  const [savingWater, setSavingWater] = useState(false);
  const router = useRouter();

  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      router.push("/login");
      return true;
    }
    return false;
  };

  const handleAddMeal = async () => {
    if (!foodName || !mealCalories) {
      alert("Please enter food item and calories.");
      return;
    }

    try {
      setSavingMeal(true);
      await api.post("/entries/meals", {
        mealType,
        name: foodName,
        calories: Number(mealCalories),
      });

      alert("Meal saved.");
      setFoodName("");
      setMealCalories("");
      onSaved?.();
    } catch (err) {
      if (handleAuthError(err)) return;
      alert(err?.response?.data?.message || "Failed to save meal");
    } finally {
      setSavingMeal(false);
    }
  };

  const handleAddWater = async (amount) => {
    try {
      setSavingWater(true);
      await api.post("/entries/water/add", { amount });
      onSaved?.();
    } catch (err) {
      if (handleAuthError(err)) return;
      alert(err?.response?.data?.message || "Failed to add water");
    } finally {
      setSavingWater(false);
    }
  };

  const handleSetManualWater = async () => {
    if (manualWater === "") return;
    try {
      setSavingWater(true);
      await api.put("/entries/water", { water: Number(manualWater) });
      alert("Water intake updated.");
      setManualWater("");
      onSaved?.();
    } catch (err) {
      if (handleAuthError(err)) return;
      alert(err?.response?.data?.message || "Failed to update water");
    } finally {
      setSavingWater(false);
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Log Meal</h2>
        <div className="space-y-3">
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-gray-800 outline-none transition focus:border-emerald-500"
          >
            {mealTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
            placeholder="Food item name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
            placeholder="Calories"
            value={mealCalories}
            onChange={(e) => setMealCalories(e.target.value)}
            type="number"
            min="0"
          />
          <button
            onClick={handleAddMeal}
            disabled={savingMeal}
            className="w-full rounded-xl bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingMeal ? "Saving..." : "Add Meal"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Hydration</h2>
        <p className="mb-4 text-sm text-gray-500">Today: {water} ml</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAddWater(250)}
            disabled={savingWater}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
          >
            +250 ml
          </button>
          <button
            onClick={() => handleAddWater(500)}
            disabled={savingWater}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
          >
            +500 ml
          </button>
          <button
            onClick={() => handleAddWater(1000)}
            disabled={savingWater}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
          >
            +1L
          </button>
        </div>
        <div className="mt-3 flex gap-2">
      <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none transition focus:border-emerald-500"
            placeholder="Set water manually (ml)"
            value={manualWater}
            onChange={(e) => setManualWater(e.target.value)}
        type="number"
        min="0"
      />
      <button
            onClick={handleSetManualWater}
            disabled={savingWater}
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
            Save
      </button>
        </div>
      </div>
    </section>
  );
}