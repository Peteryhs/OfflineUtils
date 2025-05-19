'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsState {
  theme: 'light' | 'dark';
  defaultSaveLocation: string;
  preferredFormat: string;
}

const defaultSettings: SettingsState = {
  theme: 'dark',
  defaultSaveLocation: 'downloads',
  preferredFormat: 'pdf'
};

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const settingsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSettingChange = (key: keyof SettingsState, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={settingsRef}
            className="menu-dropdown relative w-96 rounded-xl bg-gray-900 border border-gray-800 p-4"
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            
            <div className="space-y-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="menu-item w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Save Location</label>
                <select
                  value={settings.defaultSaveLocation}
                  onChange={(e) => handleSettingChange('defaultSaveLocation', e.target.value)}
                  className="menu-item w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary"
                >
                  <option value="downloads">Downloads</option>
                  <option value="documents">Documents</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Format</label>
                <select
                  value={settings.preferredFormat}
                  onChange={(e) => handleSettingChange('preferredFormat', e.target.value)}
                  className="menu-item w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary"
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}