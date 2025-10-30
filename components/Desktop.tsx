import React from 'react';
import type { AppConfig } from '../types';

interface DesktopProps {
  apps: AppConfig[];
  openApp: (appId: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({ apps, openApp }) => {
  return (
    <div className="absolute inset-0 p-4">
      <div className="flex flex-col flex-wrap h-full content-start">
        {apps.map(app => (
          <button
            key={app.id}
            onDoubleClick={() => openApp(app.id)}
            className="flex flex-col items-center p-3 rounded hover:bg-white/10 w-28"
          >
            {app.icon('w-12 h-12')}
            <span className="text-white text-sm mt-2 text-center shadow-black [text-shadow:1px_1px_2px_var(--tw-shadow-color)]">{app.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Desktop;