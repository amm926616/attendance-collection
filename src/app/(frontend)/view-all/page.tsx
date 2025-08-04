"use client";

import { useEffect, useState } from "react";

interface Checkin {
  _id: string;
  name: string;
  classId: string;
  timestamp: string;
}

export default function ViewAllPage() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchCheckins();
  }, []);

  // Group checkins by classId
  const grouped = checkins.reduce<Record<string, Checkin[]>>((acc, curr) => {
    if (!acc[curr.classId]) acc[curr.classId] = [];
    acc[curr.classId].push(curr);
    return acc;
  }, {});

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
                className="py-1 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <span className="font-semibold">{name}</span> -{" "}
                <time dateTime={timestamp}>
                  {new Date(timestamp).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
