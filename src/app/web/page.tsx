"use client";

"use client";

import Header from "../components/Header";
import HtmlRenderer from "./components/HtmlRenderer"; // Added import for HtmlRenderer

export default function WebTools() {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <Header />
      <div className="max-w-4xl w-full mx-auto pt-16 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-4">Web Tools</h1>
        <div className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
          <HtmlRenderer />
        </div>
      </div>
    </div>
  );
}