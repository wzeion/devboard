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
        techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
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
      <div className="min-h-screen bg-white dark:bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading projects...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-[#e6edf3] p-8 fade-up">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium text-sm transition-all"
          >
            <Plus size={15} /> New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 bg-gray-100 dark:bg-[#161b22] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Folder size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-1">
              No projects yet
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium transition-all"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-[#161b22] rounded-lg p-5 border border-gray-200 dark:border-[#30363d] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h2>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                {project.description && (
                  <p className="text-gray-500 dark:text-[#8b949e] text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#21262d]">
                  <span className="text-gray-400 dark:text-[#8b949e] text-xs">
                    {project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""}
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 text-xs font-medium transition-all"
                  >
                    Open <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#161b22] rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-[#30363d] shadow-xl">
            <h2 className="text-lg font-semibold mb-5">New Project</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Project title"
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
              <input
                type="text"
                placeholder="Tech stack (comma separated)"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
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