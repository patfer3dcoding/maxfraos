import React from 'react';
import type { AppConfig } from '../types';

interface DesktopProps {
  apps: AppConfig[];
  openApp: (appId: string) => void;
}

// Define the desired layout for the desktop icons, grouped into categories.
const DESKTOP_LAYOUT: Record<string, string[]> = {
  "Academy Management": [
    'studentDatabase',
    'calendar',
    'checkIn',
  ],
  "Tools & Finance": [
    'calculator',
    'clipCalculator',
    'whiteboard',
    'browser',
  ],
  "Productivity & Resources": [
    'quickReplies',
    'maxfraOfficeSuite',
    'library',
    'notepad',
  ],
  "System": [
    'fileExplorer',
    'settings',
  ]
};

const Desktop: React.FC<DesktopProps> = ({ apps, openApp }) => {
  // Create a map for quick lookup of apps by their ID.
  const appsById = new Map<string, AppConfig>(apps.map(app => [app.id, app]));

  return (
    <div className="absolute inset-0 p-6">
      <div className="flex flex-row flex-wrap items-start gap-x-8 gap-y-6">
        {Object.entries(DESKTOP_LAYOUT).map(([groupTitle, appIds]) => {
          // Filter out any appIds that don't have a corresponding app config
          const validAppIds = appIds.filter(id => appsById.has(id));
          if (validAppIds.length === 0) return null;

          return (
            <div key={groupTitle} className="flex flex-col items-start gap-y-2">
              <h2 className="text-white text-base font-semibold mb-2 pl-3 w-48 border-b border-white/20 pb-2 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)]">
                {groupTitle}
              </h2>
              {validAppIds.map(appId => {
                const app = appsById.get(appId)!; // We know it exists because of the filter
                
                return (
                  <button
                    key={app.id}
                    onDoubleClick={() => openApp(app.id)}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 w-48 transition-colors duration-150"
                  >
                    {app.icon('w-7 h-7')}
                    <span className="text-white text-sm text-left truncate [text-shadow:1px_1px_2px_rgba(0,0,0,0.7)]">
                      {app.title}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Desktop;