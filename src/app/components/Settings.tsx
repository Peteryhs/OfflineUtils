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
            // Removed bg-gray-900 and border border-gray-800, relying on .menu-dropdown class from globals.css
            className="menu-dropdown relative w-96 rounded-xl p-4"
          >
            {/* Updated title text color */}
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Settings</h2>
            
            {/* Updated inner content panel styling */}
            <div className="space-y-6 bg-muted p-4 rounded-xl border border-border">
              <div className="space-y-2">
                {/* Updated label text color */}
                <label htmlFor="themeSelect" className="block text-sm font-medium text-muted-foreground">Theme</label>
                <select
                  id="themeSelect"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  // Applied standard input styling
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="saveLocationSelect" className="block text-sm font-medium text-muted-foreground">Default Save Location</label>
                <select
                  id="saveLocationSelect"
                  value={settings.defaultSaveLocation}
                  onChange={(e) => handleSettingChange('defaultSaveLocation', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                >
                  <option value="downloads">Downloads</option>
                  <option value="documents">Documents</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="formatSelect" className="block text-sm font-medium text-muted-foreground">Preferred Format</label>
                <select
                  id="formatSelect"
                  value={settings.preferredFormat}
                  onChange={(e) => handleSettingChange('preferredFormat', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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