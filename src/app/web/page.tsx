"use client";

"use client";

import Header from "../components/Header";
import HtmlRenderer from "./components/HtmlRenderer"; // Added import for HtmlRenderer

export default function WebTools() {
  return (
    <div className="min-h-screen p-0 md:p-0 bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <Header />
      <div className="w-full mx-auto pt-16 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-8">Web Tools</h1>
        <HtmlRenderer />
      </div>
    </div>
  );
}