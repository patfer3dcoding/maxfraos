import React from 'react';
import { MAXFRA_LOGO_B64 } from '../constants';

// --- Branding & OS Icons ---

export const MaxfraLogoIcon = (className: string = 'w-8 h-8') => (
  <img src={MAXFRA_LOGO_B64} alt="Maxfra Logo" className={className} />
);

export const WindowsLogoIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="23" height="23" fill="#F25022"/>
    <rect x="27" y="0" width="23" height="23" fill="#7FBA00"/>
    <rect x="0" y="27" width="23" height="23" fill="#00A4EF"/>
    <rect x="27" y="27" width="23" height="23" fill="#FFB900"/>
  </svg>
);

// --- Application Icons ---

export const NotepadIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 256 256" fill="none">
    <rect width="256" height="256" fill="none"/>
    <path d="M184,32H72A16,16,0,0,0,56,48V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V48A16,16,0,0,0,184,32Zm-96,24h80v8H88Z" fill="#a8cce3"/>
    <path d="M184,32H72A16,16,0,0,0,56,48V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V48A16,16,0,0,0,184,32Z" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2"/>
    <rect x="56" y="48" width="144" height="160" rx="16" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2"/>
    <line x1="88" y1="96" x2="168" y2="96" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="88" y1="136" x2="168" y2="136" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="88" y1="176" x2="136" y2="176" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
  </svg>
);


// --- File System & Navigation Icons ---
export const FolderIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
);
export const FileIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
);
export const ChevronLeftIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
export const ChevronRightIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
export const ReloadIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);
export const HomeIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
export const PlusIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
export const CloseIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
export const TrashIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
export const SearchIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
export const ShareIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);
export const UploadIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);
export const MicrophoneIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

// --- App Specific Icons ---
export const MaxfraWordIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M56,48V208a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V88L144,48Z" opacity="0.2"/><path d="M192,216H64a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h80l56,40V208A8,8,0,0,1,192,216Z" fill="none" stroke="#2c5282" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><polyline points="144 48 144 88 200 88" fill="none" stroke="#2c5282" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><path d="M96,144l16,32,16-32,16,32,16-32" fill="none" stroke="#4299e1" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const MaxfraExcelIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M56,48V208a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V88L144,48Z" opacity="0.2"/><path d="M192,216H64a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h80l56,40V208A8,8,0,0,1,192,216Z" fill="none" stroke="#276749" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><polyline points="144 48 144 88 200 88" fill="none" stroke="#276749" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><line x1="100" y1="148" x2="156" y2="148" stroke="#48bb78" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><line x1="128" y1="120" x2="128" y2="176" stroke="#48bb78" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const MaxfraOutlookIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M216,64H40a8,8,0,0,0-8,8V184a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V72A8,8,0,0,0,216,64Z" opacity="0.2"/><path d="M32,184V72L123.4,124.9a8,8,0,0,0,8.2,0L224,72v112" fill="none" stroke="#0078d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><path d="M224,72H32a8,8,0,0,0-8,8v104a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V80A8,8,0,0,0,224,72Z" fill="none" stroke="#0078d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const WhatsAppIcon = (className: string = 'w-6 h-6') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.003 2.014.623 3.935 1.737 5.62l-1.157 4.224 4.273-1.12zM15.77 14.392c-.226-.113-1.333-.657-1.54- .732-.206-.075-.355-.113-.505.113-.149.227-.582.732-.714.882-.132.149-.263.168-.488.056-.227-.113-.964-.355-1.838-1.133-.68-.613-1.139-1.365-1.271-1.614-.132-.249-.013-.382.099-.505.101-.113.226-.29.34-.436.113-.149.149-.249.226-.412.075-.162.037-.302-.019-.412-.056-.113-.505-1.217-.689-1.666-.184-.449-.368-.386-.505-.392-.125-.006-.263-.006-.4-.006-.138 0-.355.056-.539.263-.184.206-.714.689-.714 1.666s.731 1.933.829 2.07c.099.138 1.455 2.206 3.528 3.109.553.249.985.399 1.32.512.522.176.992.15.1373.093.435-.056 1.333-.545 1.52-1.071.184-.523.184-.964.131-1.07c-.053-.113-.184-.168-.411-.28z"/>
  </svg>
);
export const CheckInIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-4-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <polyline points="9 14 12 17 15 11"></polyline>
  </svg>
);
export const ClipIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H6.3l1.9-3.3c.1-.2.1-.4 0-.6L6.3 8h2.2l1.2 2.1c.1.2.1.4 0 .6L8.5 15zm6.2-1.1l-1.9-3.3c-.1-.2-.1-.4 0-.6l1.9-3.3H17l-2.2 3.9c-.1.2-.1.4 0 .6L17 15h-2.3z"/>
    </svg>
);
export const FileExplorerIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fill="#fbb03b" d="M20,6h-8l-2-2H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z"/>
  </svg>
);
export const MaxfraAIBrowserIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="1.5" y1="12" x2="4" y2="12"></line>
    <line x1="20" y1="12" x2="22.5" y2="12"></line>
    <line x1="12" y1="1.5" x2="12" y2="4"></line>
    <line x1="12" y1="20" x2="12" y2="22.5"></line>
  </svg>
);
export const StudentDatabaseIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
export const CalendarIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
export const SettingsIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);
export const CalculatorIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="12" y1="10" x2="12" y2="18"></line>
    <line x1="8" y1="14" x2="16" y2="14"></line>
  </svg>
);
export const MaxfraOfficeSuiteIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="7" y="7" width="4" height="4" fill="#4299e1"></rect>
    <rect x="7" y="13" width="4" height="4" fill="#48bb78"></rect>
    <rect x="13" y="7" width="4" height="4" fill="#0078d4"></rect>
    <rect x="13" y="13" width="4" height="4" fill="#f56565"></rect>
  </svg>
);
export const LibraryIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
export const ImageIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

// --- Window Control Component ---
export const WindowControls = ({ onMinimize, onMaximize, onRestore, onClose, isMaximized }: { onMinimize: () => void; onMaximize: () => void; onRestore: () => void; onClose: () => void; isMaximized: boolean; }) => (
  <div className="flex">
    <button onClick={onMinimize} className="p-3 hover:bg-white/10">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
    </button>
    <button onClick={isMaximized ? onRestore : onMaximize} className="p-3 hover:bg-white/10">
      {isMaximized ? (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14h10v-5M5 10H3V4h6v2"></path></svg>
      ) : (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3z"></path></svg>
      )}
    </button>
    <button onClick={onClose} className="p-3 hover:bg-red-500">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  </div>
);