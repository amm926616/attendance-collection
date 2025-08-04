import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto p-6 mt-12 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">📋 Class Attendance Check-In</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Welcome. Please visit your class check-in link below or enter a direct
        URL.
      </p>

      <ul className="mt-6 space-y-3">
        <li>
          <Link
            href="/math101"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Go to Math 101
          </Link>
        </li>
        <li>
          <Link
            href="/aug4"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Go to August 4 Class
          </Link>
        </li>
        <li>
          <Link
            href="/science"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Go to Science Class
          </Link>
        </li>
      </ul>

      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        You can also send students links like:{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
          /math101
        </code>{" "}
        or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
          /classABC
        </code>
      </p>
    </main>
  );
}
