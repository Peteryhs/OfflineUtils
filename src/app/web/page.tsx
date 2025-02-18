"use client";

import Header from "../components/Header";

export default function WebTools() {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-3xl font-bold mb-8">Web Tools</h1>
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
          <p className="text-gray-400">Web tools coming soon...</p>
        </div>
      </div>
    </div>
  );
}