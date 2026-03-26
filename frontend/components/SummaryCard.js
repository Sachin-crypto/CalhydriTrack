export default function SummaryCard({ data }) {
  if (!data) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Today&apos;s Summary</h2>
        <p className="text-sm text-gray-500">No data yet. Add your first entry for today.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Today&apos;s Summary</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Meal Calories</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-900">{data.totalMealCalories}</p>
        </div>
        <div className="rounded-xl bg-sky-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-sky-700">Water (ml)</p>
          <p className="mt-1 text-2xl font-semibold text-sky-900">{data?.water ?? 0}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Daily Total Calories</p>
          <p className="mt-1 text-2xl font-semibold text-amber-900">{data.dailyCaloriesTotal}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {["BREAKFAST", "LUNCH", "DINNER", "SNACKS"].map((mealType) => (
          <div key={mealType} className="rounded-xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {mealType.charAt(0) + mealType.slice(1).toLowerCase()}
              </h3>
              <p className="text-sm text-gray-500">{data.mealTotals?.[mealType] || 0} kcal</p>
            </div>
            <div className="space-y-2">
              {(data.meals?.[mealType] || []).length === 0 ? (
                <p className="text-sm text-gray-400">No items logged</p>
              ) : (
                data.meals[mealType].map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-sm text-gray-700">{meal.name}</p>
                    <p className="text-sm font-medium text-gray-900">{meal.calories} kcal</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}