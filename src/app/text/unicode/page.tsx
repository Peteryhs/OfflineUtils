"use client";

import UnicodeGenerator from "../components/UnicodeGenerator";
import Header from "../../components/Header";

export default function UnicodeGeneratorPage() {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black relative">
      <Header />
      <div className="max-w-4xl mx-auto space-y-6 pt-16">
        <div className="w-full rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl p-8 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ease-out animate-fade-in opacity-0 scale-95" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <UnicodeGenerator />
        </div>
      </div>
    </div>
  );
}