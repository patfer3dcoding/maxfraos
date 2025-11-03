import React from 'react';

// --- Branding & OS Icons ---

export const MaxfraLogoIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 100V0H20V70L50 20L80 70V0H100V100H80L50 50L20 100H0Z" 
            fill="#F96921"
        />
    </svg>
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
export const PowerIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
    <line x1="12" y1="2" x2="12" y2="12"></line>
  </svg>
);

// --- App Specific Icons ---
export const WhiteboardIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v12H3z"></path>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <path d="M12 18v3"></path>
        <path d="M8 21h8"></path>
        <path d="m9 9 2 2 2-2 2 2"></path>
    </svg>
);
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
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.003 2.014.623 3.935 1.737 5.62l-1.157 4.224 4.273-1.12zM15.77 14.392c-.226-.113-1.333-.657-1.54- .732-.206-.075-.355-.113-.505.113-.149.227-.582.732-.714.882-.132.149-.263.168-.488.056-.227-.113-.964-.355-1.838-1.133-.68-.613-1.139-1.365-1.271-1.614-.132-.249-.013-.382.099-.505.101-.113.226-.29.34-.436.113-.149.149-.249.226-.412.075-.162.037-.302-.019-.412-.056-.113-.505-1.217-.689-1.666-.184-.449-.368-.386-.505-.392-.125-.006-.263-.006-.4-.006-.138 0-.355.056-.539.2