"use client";
import { useEffect, useState } from "react";
import { Folder, CheckSquare, Clock, BarChart2, Activity } from "lucide-react";
import Link from "next/link";
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

const statCards = (data: DashboardData) => [
  {
    label: "Total Projects",
    value: data.totalProjects,
    icon: Folder,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Total Tasks",
    value: data.totalTasks,
    icon: BarChart2,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    label: "Completed",
    value: data.completedTasks,
    icon: CheckSquare,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    label: "In Progress",
    value: data.inProgressTasks,
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

const chartColors = {
  TODO: "#6b7280",
  IN_PROGRESS: "#3b82f6",
  DONE: "#22c55e",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );

  if (!data) return null;

  const chartData = [
    { name: "To Do", value: data.todoTasks, status: "TODO" },
    { name: "In Progress", value: data.inProgressTasks, status: "IN_PROGRESS" },
    { name: "Done", value: data.completedTasks, status: "DONE" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/projects"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm"
          >
            View Projects
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards(data).map((card) => (
            <div
              key={card.label}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800"
            >
              <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-4`}>
                <card.icon size={20} className={card.color} />
              </div>
              <p className="text-3xl font-bold mb-1">{card.value}</p>
              <p className="text-gray-400 text-sm">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Chart + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="font-semibold text-gray-200 mb-6">Tasks by Status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={48}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={chartColors[entry.status as keyof typeof chartColors]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Log */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-blue-400" />
              <h2 className="font-semibold text-gray-200">Recent Activity</h2>
            </div>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {data.recentLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">No activity yet.</p>
              ) : (
                data.recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                    <div>
                      <p className="text-gray-300">{log.action}</p>
                      {log.project && (
                        <p className="text-gray-500 text-xs">
                          {log.project.title}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs">
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