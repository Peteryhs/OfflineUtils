"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const utilityCards = [
  {
    title: "Format Converter",
    description: "Convert images and PDFs between formats",
    icon: "/convert.svg",
    path: "/convert"
  },
  {
    title: "Image Cropper",
    description: "Crop, resize, and edit images with an intuitive interface",
    icon: "/file.svg",
    path: "/image"
  },
  {
    title: "Text Tools",
    description: "Various text manipulation utilities",
    icon: "/window.svg",
    path: "/text"
  },
  {
    title: "Web Tools",
    description: "URL encoding, decoding, and more",
    icon: "/globe.svg",
    path: "/web"
  },
  {
    title: "PDF Merge",
    description: "Combine anything into a PDF file",
    icon: "/merge.svg",
    path: "/convert/pdf-merge"
  },
  {
    title: "Unicode Generator",
    description: "Generate and convert Unicode characters",
    icon: "/window.svg",
    path: "/text/unicode"
  },
  {
    title: "Image Metadata",
    description: "View and modify image metadata and EXIF information",
    icon: "/file.svg",
    path: "/metadata"
  },
  {
    title: "Flashcards",
    description: "Create and study with interactive flashcards",
    icon: "/window.svg",
    path: "/flashcard"
  },
  {
    title: "HTML Renderer",
    description: "Render and preview HTML code snippets securely.",
    icon: "/globe.svg", // Using globe as it's web related, and /web page uses it.
    path: "/web"
  },
];

import Header from './components/Header';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState(utilityCards);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    const filtered = utilityCards.filter(card =>
      card.title.toLowerCase().includes(query.toLowerCase()) ||
      card.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCards(filtered);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black relative">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pt-16">
        {filteredCards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.path)}
            className="group p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 hover:border-gray-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ease-out cursor-pointer animate-fade-in opacity-0 scale-95"
            style={{
              animationDelay: `${filteredCards.indexOf(card) * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-all duration-300">
                <Image src={card.icon} alt={card.title} width={24} height={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">{card.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 md:px-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search utilities..."
            className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-xl rounded-2xl border-2 border-transparent bg-clip-padding hover:border-gray-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(31,41,55,0.2)] focus:shadow-[0_8px_48px_rgba(59,130,246,0.3)] placeholder-gray-500/75 animate-float bg-gradient-to-r from-gray-900/50 via-gray-800/50 to-gray-900/50 hover:bg-gradient-to-r hover:from-gray-800/50 hover:via-gray-700/50 hover:to-gray-800/50"
            style={{
              WebkitBackdropFilter: 'blur(16px)',
              backdropFilter: 'blur(16px)',
            }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
