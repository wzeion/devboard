"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import KanbanBoard from "@/components/kanban/KanbanBoard";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
}

export default function ProjectPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await fetch(`/api/tasks?projectId=${id}`);
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!title.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
        projectId: id,
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setShowModal(false);
      fetchTasks();
    }
  }

  async function handleStatusChange(taskId: string, status: string) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(taskId: string) {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchTasks();
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading board...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-[#e6edf3] p-8 fade-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#161b22] transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Project Board
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium text-sm transition-all"
          >
            <Plus size={15} /> New Task
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Filter
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-md bg-white dark:bg-[#161b22] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-md bg-white dark:bg-[#161b22] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {(priorityFilter !== "ALL" || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setPriorityFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="text-xs text-emerald-500 hover:text-emerald-400 font-medium transition-all"
            >
              Clear filters
            </button>
          )}
        </div>

        <KanbanBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#161b22] rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-[#30363d] shadow-xl">
            <h2 className="text-lg font-semibold mb-5">New Task</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 text-sm"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 resize-none text-sm"
                rows={3}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white border border-gray-200 dark:border-[#30363d] focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCreate}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-[#30363d] hover:bg-gray-50 dark:hover:bg-[#21262d] rounded-md text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}