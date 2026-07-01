"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Calendar, Flag } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
}

const priorityColors = {
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400",
};

const statusColumns = ["TODO", "IN_PROGRESS", "DONE"] as const;
const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function ProjectPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");

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
    fetchTasks();
  }

  async function handleDelete(taskId: string) {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchTasks();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Project Board</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusColumns.map((status) => (
              <div key={status} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h2 className="font-semibold text-gray-300 mb-4">
                  {statusLabels[status]}{" "}
                  <span className="text-gray-500 text-sm">
                    ({tasks.filter((t) => t.status === status).length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === status)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm">{task.title}</h3>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-500 hover:text-red-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-gray-400 text-xs mb-3">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`flex items-center gap-1 text-xs ${priorityColors[task.priority]}`}>
                            <Flag size={12} />
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar size={12} />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="mt-3 w-full text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md space-y-4 border border-gray-800">
            <h2 className="text-xl font-bold">New Task</h2>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg"
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