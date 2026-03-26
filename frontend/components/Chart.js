"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Chart({ data }) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Calories",
            data: data.map((d) => d.calories),
          },
          {
            label: "Water",
            data: data.map((d) => d.water),
          },
        ],
      }}
    />
  );
}