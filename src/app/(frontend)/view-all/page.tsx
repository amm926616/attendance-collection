"use client";

import { useEffect, useState } from "react";

interface Checkin {
  _id: string;
  name: string;
  classId: string;
  timestamp: string;
}

const ADMIN_PASSWORD_KEY = "adminPassword";

export default function ViewAllPage() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!storedPassword) {
      const userInput = prompt("Enter admin password:");
      if (userInput) {
        setPassword(userInput);
        localStorage.setItem(ADMIN_PASSWORD_KEY, userInput);
      }
    } else {
      setPassword(storedPassword);
    }
  }, []);

  useEffect(() => {
    if (!password) return;
    fetchCheckins();
  }, [password]);

  async function fetchCheckins() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkin/all");
      if (!res.ok) throw new Error("Failed to fetch check-ins");
      const data = await res.json();
      setCheckins(data.checkins);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/checkin/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setCheckins((prev) => prev.filter((entry) => entry._id !== id));
    } else {
      alert("Failed to delete. Wrong password or server error.");
    }
  }

  // Group checkins by classId
  const grouped = checkins.reduce<Record<string, Checkin[]>>((acc, curr) => {
    if (!acc[curr.classId]) acc[curr.classId] = [];
    acc[curr.classId].push(curr);
    return acc;
  }, {});

  if (!password) return <p className="text-center mt-20">Password required.</p>;
  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <main className="max-w-4xl mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        All Attendance Records
      </h1>

      {Object.entries(grouped).length === 0 && (
        <p>No attendance records found.</p>
      )}

      {Object.entries(grouped).map(([classId, records]) => (
        <section key={classId} className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Class: <span className="font-mono">{classId}</span> (
            {records.length})
          </h2>
          <ul className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800">
            {records.map(({ _id, name, timestamp }) => (
              <li
                key={_id}
                className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <span>
                  <strong>{name}</strong> —{" "}
                  <time className="text-sm" dateTime={timestamp}>
                    {new Date(timestamp).toLocaleString()}
                  </time>
                </span>
                <button
                  onClick={() => handleDelete(_id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
