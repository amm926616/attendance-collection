"use client";

import { useEffect, useState } from "react";

const ADMIN_PASSWORD_KEY = "adminPassword";

export default function AdminPage() {
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);

  // ask for password once
  useEffect(() => {
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!storedPassword) {
      const input = prompt("Enter admin password:");
      if (input) {
        setPassword(input);
        localStorage.setItem(ADMIN_PASSWORD_KEY, input);
      }
    } else {
      setPassword(storedPassword);
    }
  }, []);

  useEffect(() => {
    if (!password) return;
    fetchClasses();
  }, [password]);

  async function fetchClasses() {
    const res = await fetch("/api/classes");
    if (res.ok) {
      const data = await res.json();
      setClasses(data.classes.map((c: { name: string }) => c.name));
    }
  }

  async function handleDeleteClass(classId: string) {
    const confirmDelete = confirm(
      `Delete ALL attendance records for class "${classId}"? This cannot be undone.`,
    );
    if (!confirmDelete) return;

    const res = await fetch("/api/classes/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, password }),
    });

    if (res.ok) {
      setClasses((prev) => prev.filter((entry) => entry !== classId));
    } else {
      alert("Failed to delete class. Wrong password or server error.");
    }
  }

  async function handleAddClass() {
    setError("");
    if (!className.trim()) return setError("Class name cannot be empty");

    setLoading(true);
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: className.trim() }),
    });

    setLoading(false);

    if (res.ok) {
      setClassName("");
      fetchClasses();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add class");
    }
  }

  function copyLink(classId: string) {
    const url = `${window.location.origin}/classes/${classId}`;
    navigator.clipboard.writeText(url);
    setCopiedClassId(classId);
    setTimeout(() => setCopiedClassId(null), 2000);
  }

  if (!password) return <p className="text-center mt-20">Password required.</p>;

  return (
    <main className="max-w-lg mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Admin: Manage Classes
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="New class name (e.g. math234)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        {error && <p className="text-red-600 mt-1">{error}</p>}
      </div>

      <button
        onClick={handleAddClass}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Class"}
      </button>

      <h2 className="mt-8 text-xl font-semibold text-gray-800 dark:text-gray-200">
        Existing Classes
      </h2>
      <ul className="mt-2 space-y-2">
        {classes.length === 0 ? (
          <li>No classes yet</li>
        ) : (
          classes.map((cls) => (
            <li
              key={cls}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded"
            >
              <span className="font-mono text-gray-900 dark:text-gray-100">
                {cls}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(cls)}
                  className={`px-3 py-1 text-sm text-white rounded transition ${
                    copiedClassId === cls
                      ? "bg-green-800"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {copiedClassId === cls ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={() => handleDeleteClass(cls)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete Class
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
