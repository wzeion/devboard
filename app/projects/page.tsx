"use client";
import { useEffect, useState } from "react";
import { Plus, Folder, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  _count: { tasks: number };
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!title.trim()) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        techStack: techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setTechStack("");
      setShowModal(false);
      fetchProjects();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading projects...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <Folder size={48} className="mx-auto mb-4 opacity-50" />
            <p>No projects yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {project.description && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-blue-500 dark:text-blue-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    {project._count.tasks} tasks
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Open <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-md space-y-4 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold">New Project</h2>
            <input
              type="text"
              placeholder="Project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
            <input
              type="text"
              placeholder="Tech stack (comma separated: React, Node, PostgreSQL)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
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