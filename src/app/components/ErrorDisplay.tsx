"use client";

interface ErrorDisplayProps {
  title: string;
  message: string;
}

export default function ErrorDisplay({ title, message }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md border border-neutral-200 bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-neutral-800 uppercase mb-1">{title}</h1>
        <p className="text-gray-700 text-sm">{message}</p>
      </div>
    </div>
  );
}
