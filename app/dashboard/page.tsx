"use client";
import { useEffect, useState } from "react";
import { Folder, CheckSquare, Clock, BarChart2, Activity } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  recentLogs: {
    id: string;
    action: string;
    createdAt: string;
    project: { title: string } | null;
  }[];
}

const chartColors = {
  TODO: "#6b7280",
  IN_PROGRESS: "#10b981",
  DONE: "#059669",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchDashboard() {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );

  if (!data) return null;

  const statCards = [
    {
      label: "Total Projects",
      value: data.totalProjects,
      icon: Folder,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Tasks",
      value: data.totalTasks,
      icon: BarChart2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Completed",
      value: data.completedTasks,
      icon: CheckSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "In Progress",
      value: data.inProgressTasks,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  const chartData = [
    { name: "To Do", value: data.todoTasks, status: "TODO" },
    { name: "In Progress", value: data.inProgressTasks, status: "IN_PROGRESS" },
    { name: "Done", value: data.completedTasks, status: "DONE" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-[#e6edf3] p-8 fade-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Overview of your projects and tasks
            </p>
          </div>
          <Link
            href="/projects"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium text-sm transition-all"
          >
            View Projects
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-[#161b22] rounded-lg p-5 border border-gray-200 dark:border-[#30363d] hover:border-emerald-500/50 transition-all"
            >
              <div className={`inline-flex p-2 rounded-md ${card.bg} mb-4`}>
                <card.icon size={16} className={card.color} />
              </div>
              <p className="text-3xl font-bold tracking-tight mb-1">
                {card.value}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#161b22] rounded-lg p-6 border border-gray-200 dark:border-[#30363d]">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
              Tasks by Status
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={32} barCategoryGap="40%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: isDark ? "#8b949e" : "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: isDark ? "#8b949e" : "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{
                    fill: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.03)",
                    radius: 6,
                  }}
                  contentStyle={{
                    backgroundColor: isDark ? "#1c2128" : "#ffffff",
                    border: `1px solid ${isDark ? "#30363d" : "#e5e7eb"}`,
                    borderRadius: "6px",
                    color: isDark ? "#e6edf3" : "#111827",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{
                    color: isDark ? "#8b949e" : "#6b7280",
                    fontSize: "12px",
                  }}
                  itemStyle={{
                    color: isDark ? "#e6edf3" : "#111827",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                  background={{
                    fill: isDark ? "#0d1117" : "#f9fafb",
                    radius: 4,
                  }}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={
                        chartColors[entry.status as keyof typeof chartColors]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-[#161b22] rounded-lg p-6 border border-gray-200 dark:border-[#30363d]">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={14} className="text-emerald-500" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recent Activity
              </h2>
            </div>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {data.recentLogs.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity yet.</p>
              ) : (
                data.recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-gray-700 dark:text-[#c9d1d9] text-sm">
                        {log.action}
                      </p>
                      {log.project && (
                        <p className="text-gray-400 dark:text-[#8b949e] text-xs mt-0.5">
                          {log.project.title}
                        </p>
                      )}
                      <p className="text-gray-300 dark:text-[#484f58] text-xs mt-0.5">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}