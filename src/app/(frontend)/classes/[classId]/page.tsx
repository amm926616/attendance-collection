"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClassPage() {
  const params = useParams();
  const classId = params.classId as string;

  const [validClass, setValidClass] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("");
  const [hasCheckedIn, setHasCheckedIn] = useState<boolean>(false);

  useEffect(() => {
    async function verifyClass() {
      const res = await fetch("/api/classes");
      if (res.ok) {
        const data = await res.json();
        setValidClass(
          data.classes.some((c: { name: string }) => c.name === classId),
        );
      } else {
        setValidClass(false);
      }
    }
    verifyClass();
  }, [classId]);

  useEffect(() => {
    if (!validClass) return;

    const storedName = localStorage.getItem("studentName");
    if (storedName) {
      setName(storedName);
      checkCheckedIn(storedName, classId);
    } else {
      const input = prompt("Enter your real name:");
      if (input) {
        localStorage.setItem("studentName", input);
        setName(input);
        checkCheckedIn(input, classId);
      }
    }
  }, [validClass, classId]);

  async function checkCheckedIn(name: string, classId: string) {
    const res = await fetch(
      `/api/checkin?name=${encodeURIComponent(name)}&classId=${encodeURIComponent(classId)}`,
    );
    if (res.ok) {
      const data = await res.json();
      setHasCheckedIn(data.checkedIn);
    }
  }

  const handleCheckin = async () => {
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, classId }),
    });

    if (res.ok) {
      alert("You have checked in successfully.");
      setHasCheckedIn(true);
    } else {
      alert("Check-in failed.");
    }
  };

  if (validClass === null) {
    return (
      <main className="max-w-md mx-auto mt-16 p-6 text-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!validClass) {
    return (
      <main className="max-w-md mx-auto mt-16 p-6 text-center text-red-600">
        <h1 className="text-xl font-semibold">Invalid class ID</h1>
        <p>Please check the link or tell your teacher.</p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Class ID: <span className="font-mono">{classId}</span>
      </h1>
      <h2 className="text-lg mb-6 text-gray-700 dark:text-gray-300">
        Welcome, {name}
      </h2>

      {!hasCheckedIn ? (
        <button
          onClick={handleCheckin}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Check In
        </button>
      ) : (
        <p className="text-green-600 font-semibold">
          You’ve already checked in.
        </p>
      )}
    </main>
  );
}
