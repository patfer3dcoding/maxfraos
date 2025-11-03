import React, { useRef, useEffect } from 'react';
import type { AppConfig, SessionInfo } from '../types';
import * as Icons from './icons';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppConfig[];
  openApp: (appId: string) => void;
  closeStartMenu: () => void;
  onLogout: () => void;
  session: SessionInfo;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, openApp, closeStartMenu, onLogout, session }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeStartMenu();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeStartMenu]);
  
  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="fixed bottom-12 left-0 w-96 h-[600px] bg-gray-800/80 backdrop-blur-xl text-white flex flex-col shadow-2xl rounded-tr-lg z-40">
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="font-semibold mb-2 p-2">Applications</h2>
        <ul>
          {apps.map(app => (
            <li key={app.id}>
              <button
                onClick={() => openApp(app.id)}
                className="w-full flex items-center gap-4 p-3 hover:bg-white/10 rounded"
              >
                {app.icon('w-8 h-8')}
                <span className="text-base">{app.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-shrink-0 p-3 bg-black/20 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg">
            {session.username ? session.username.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="font-semibold">{session.username}</span>
        </div>
        <button onClick={onLogout} className="p-2 rounded-full hover:bg-white/10" title="Log out">
          {/* Fix: The PowerIcon is a function that returns JSX, not a component. It should be called directly. */}
          {Icons.PowerIcon("w-6 h-6")}
        </button>
      </div>
    </div>
  );
};

export default StartMenu;