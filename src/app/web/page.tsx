"use client";

"use client";

import Header from "../components/Header";
import HtmlRenderer from "./components/HtmlRenderer"; // Added import for HtmlRenderer

export default function WebTools() {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black flex flex-col"> {/* Updated padding */}
      <Header />
      <div className="w-full mx-auto pt-16 space-y-8">
        <div className="text-center"> {/* Wrapped title for explicit centering block */}
          <h1 className="text-3xl font-bold text-gray-100 mb-8">Web Tools</h1> {/* text-center removed from h1 as parent div handles it */}
        </div>
        <HtmlRenderer />
      </div>
    </div>
  );
}