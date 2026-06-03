"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardMetrics } from "@/lib/types/catalog";

export function DashboardCharts({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Inquiry Trends</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.inquiryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1d7fa8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Popular Categories</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.categoryPopularity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="views" fill="#1d7fa8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
