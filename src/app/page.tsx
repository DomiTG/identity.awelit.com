"use client";

import { trpc } from "@/utils/trpc";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Welcome
      </h1>
      <p className="text-gray-600">This is your home page.</p>
      <p className="text-gray-600">You can start building your application from here
        <span className="text-blue-500">!</span>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register User
        </button>
      </p>
    </div>
  );
}
