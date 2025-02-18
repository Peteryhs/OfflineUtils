'use client';

import { useState } from 'react';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import Settings from './Settings';

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isRootPath = pathname === '/';

  return (
    <>
      <div className="fixed top-0 left-0 p-6 z-50 flex items-center gap-4">
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push('/')}
        >
          <div className="flex flex-col">
            <span
              className={`text-2xl font-bold transition-opacity duration-200 ${isRootPath ? '' : (isHovered ? 'opacity-0' : 'opacity-100')}`}
            >
              OfflineUtils
            </span>
            <span
              className={`text-sm text-gray-400 transition-opacity duration-200 ${isRootPath ? '' : (isHovered ? 'opacity-0' : 'opacity-100')}`}
            >
              Local Utility Dashboard
            </span>
          </div>
          {!isRootPath && (
            <div
              className={`absolute top-1/2 left-0 -translate-y-1/2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <ArrowLeftIcon className="h-8 w-8 text-gray-100 hover:text-gray-300 transition-colors" />
            </div>
          )}
        </div>
        {isRootPath && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Cog6ToothIcon className="h-6 w-6 text-gray-100 hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}