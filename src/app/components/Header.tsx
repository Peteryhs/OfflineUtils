'use client';

import { useState } from 'react';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import Settings from './Settings';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isRootPath = pathname === '/';

  return (
    <>
      <header className="fixed top-0 left-0 w-full p-4 sm:p-6 z-50 flex items-center justify-between bg-gray-900 bg-opacity-50 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          {!isRootPath && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-100 hover:text-gray-300 transition-colors" />
            </button>
          )}
          <span
            onClick={() => router.push('/')}
            className="text-xl sm:text-2xl font-bold text-gray-100 cursor-pointer hover:text-gray-300 transition-colors"
          >
            OfflineUtils
          </span>
        </div>

        {isRootPath && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors"
            aria-label="Open settings"
          >
            <Cog6ToothIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-100 hover:text-gray-300 transition-colors" />
          </button>
        )}
      </header>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}