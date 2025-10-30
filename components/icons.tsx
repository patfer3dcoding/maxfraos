import React from 'react';
import { MAXFRA_LOGO_B64 } from '../constants';

export const MaxfraLogoIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <img src={MAXFRA_LOGO_B64} alt="Maxfra Logo" className={className} />
);

export const SearchIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const NotepadIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none">
    <rect width="256" height="256" fill="none"/>
    <path d="M184,32H72A16,16,0,0,0,56,48V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V48A16,16,0,0,0,184,32Zm-96,24h80v8H88Z" fill="#a8cce3"/>
    <path d="M184,32H72A16,16,0,0,0,56,48V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V48A16,16,0,0,0,184,32Z" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2"/>
    <rect x="56" y="48" width="144" height="160" rx="16" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2"/>
    <line x1="88" y1="96" x2="168" y2="96" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="88" y1="136" x2="168" y2="136" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="88" y1="176" x2="136" y2="176" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <rect x="80" y="48" width="96" height="24" fill="#6797c2"/>
  </svg>
);

export const BrowserIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zM8.38 6.06a.75.75 0 00-1.06 1.06L10.94 12 7.32 16.88a.75.75 0 001.06 1.06L12 13.06l3.62 4.88a.75.75 0 001.06-1.06L13.06 12l3.62-4.88a.75.75 0 00-1.06-1.06L12 10.94 8.38 6.06z" fill="#0078D4"/>
  </svg>
);

export const MaxfraAIBrowserIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="url(#ai-grad)" />
      <defs>
        <linearGradient id="ai-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AI</text>
    </svg>
);

export const FileExplorerIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#FFCA28">
    <path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
  </svg>
);

export const FolderIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} fill="#FFCA28" viewBox="0 0 24 24">
    <path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
  </svg>
);

export const FileIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} fill="#90A4AE" viewBox="0 0 24 24">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
);

export const SettingsIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const StudentDatabaseIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path>
        <circle cx="12" cy="8" r="2"></circle>
        <path d="M15 12H9a3 3 0 0 0-3 3v1"></path>
    </svg>
);

export const CheckInIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 11.586L10.293 9.293a1 1 0 0 1 1.414 0L16 13.586" />
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M9 12H9.01" />
        <path d="M15 12H15.01" />
        <path d="M10 16.5c.5-1 2-1 2.5 0" />
    </svg>
);


export const CalculatorIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="8" y1="7" x2="16" y2="7"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
        <line x1="8" y1="17" x2="16" y2="17"></line>
    </svg>
);

export const CalendarIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const TrashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

export const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.04 2.01C6.58 2.01 2.13 6.46 2.13 11.92c0 1.77.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.77 3.06 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91c0-5.46-4.45-9.91-9.92-9.91zM17.16 15.5c-.28-.14-1.65-.81-1.91-.91c-.26-.09-.45-.14-.64.14c-.19.28-.72.91-.89 1.1c-.16.19-.32.21-.59.07c-.28-.14-1.17-.43-2.23-1.38c-.83-.74-1.39-1.65-1.55-1.93c-.16-.28-.02-.43.12-.57c.13-.13.28-.32.42-.48c.14-.16.19-.28.28-.46c.09-.19.05-.37-.02-.51c-.07-.14-.64-1.55-.88-2.12c-.23-.57-.47-.49-.64-.5c-.16-.01-.35-.01-.54-.01c-.19 0-.49.07-.74.35c-.25.28-.96.94-.96 2.3c0 1.36.98 2.67 1.13 2.85c.14.19 1.96 3 4.75 4.22c.69.3 1.23.48 1.66.61c.71.22 1.36.19 1.86.11c.56-.08 1.65-.68 1.88-1.33c.24-.65.24-1.21.16-1.33c-.07-.12-.26-.2-.54-.34z"/>
    </svg>
);

export const ShareIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v12"></path>
    </svg>
);

export const ClipIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <img 
        src="https://upload.wikimedia.org/wikipedia/commons/8/81/Logo_de_Clip.svg" 
        alt="Clip Logo" 
        className={className} 
    />
);

export const MaxfraWordIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="8" fill="#2B579A"/>
    <path d="M17 19L24 46L32 28L40 46L47 19" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MaxfraExcelIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="8" fill="#1D6F42"/>
    <path d="M20 20L44 44M44 20L20 44" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MaxfraOutlookIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="8" fill="#0072C6"/>
    <rect x="14" y="22" width="36" height="26" rx="3" fill="white"/>
    <path d="M14 25L32 38L50 25" stroke="#0072C6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="22" r="8" fill="#0072C6"/>
    <path d="M21 19V25H27" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MaxfraOfficeSuiteIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="8" fill="#4A4A4A"/>
    <rect x="12" y="12" width="18" height="18" rx="3" fill="#2B579A"/>
    <rect x="34" y="12" width="18" height="18" rx="3" fill="#1D6F42"/>
    <rect x="12" y="34" width="40" height="18" rx="3" fill="#0072C6"/>
  </svg>
);


interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onClose: () => void;
  isMaximized: boolean;
}

export const WindowControls: React.FC<WindowControlsProps> = ({ onMinimize, onMaximize, onRestore, onClose, isMaximized }) => (
  <div className="flex items-center h-full">
    <button onClick={onMinimize} className="px-4 h-full hover:bg-white/20" aria-label="Minimize">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
      </svg>
    </button>
    <button onClick={isMaximized ? onRestore : onMaximize} className="px-4 h-full hover:bg-white/20" aria-label={isMaximized ? "Restore" : "Maximize"}>
      {isMaximized ? (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4m-6 4h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3z" />
        </svg>
      )}
    </button>
    <button onClick={onClose} className="px-4 h-full hover:bg-red-500" aria-label="Close">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export const ChevronLeftIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

export const ChevronRightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
);

export const ReloadIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6"></path>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
);

export const HomeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

export const PlusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
);

export const CloseIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);