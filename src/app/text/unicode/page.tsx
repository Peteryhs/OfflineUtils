// src/app/text/unicode/page.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header'; // Adjusted path for Header

export default function UnicodeGeneratorRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/text?tool=unicode');
  }, [router]);

  // Optional: Render a simple loading state or null
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center">
      <Header />
      <div className="text-center pt-16"> {/* Added pt-16 to avoid overlap with fixed Header */}
        <p className="text-xl text-foreground">Redirecting to Unicode Generator...</p>
        {/* You could add a spinner here:
        <svg className="animate-spin h-8 w-8 text-foreground mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        */}
      </div>
    </div>
  );
}