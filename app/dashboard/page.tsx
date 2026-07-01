import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/projects"
            className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-400 text-sm">Manage your projects and tasks</p>
          </Link>
        </div>
      </div>
    </div>
  );
}