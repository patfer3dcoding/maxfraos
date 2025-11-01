import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { FolderIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, ReloadIcon, HomeIcon, PlusIcon, CloseIcon, MaxfraWordIcon, MaxfraExcelIcon, MaxfraOutlookIcon, TrashIcon, WhatsAppIcon, SearchIcon, CheckInIcon, ShareIcon, UploadIcon, ClipIcon } from '../components/icons';
import type { AppProps, FSNode, FileNode, DirectoryNode, FileData, Student, CheckInLog, Transaction, Appointment, AttendanceRecord, StudentDocument, LibraryResource } from '../types';
import { MAXFRA_LOGO_B64, LIBRARY_IMAGES } from '../constants';
// Fix: Re-export CheckInApp as it's defined in its own file but needed by constants.tsx through this barrel file.
export { CheckInApp } from './CheckInApp';

// --- Filesystem Utilities ---
const findNodeByPath = (root: FSNode, path: string[]): DirectoryNode | null => {
    if (root.type !== 'directory') return null;
    let currentNode: DirectoryNode = root;
    for (const part of path) {
        const nextNode = currentNode.children.find(child => child.name === part && child.type === 'directory') as DirectoryNode | undefined;
        if (!nextNode) return null;
        currentNode = nextNode;
    }
    return currentNode;
};

const findOrCreateDirectoryByPath = (root: DirectoryNode, path: string[]): DirectoryNode => {
    let currentNode = root;
    for (const part of path) {
        let nextNode = currentNode.children.find(child => child.name === part && child.type === 'directory') as DirectoryNode | undefined;
        if (!nextNode) {
            const newDir: DirectoryNode = { type: 'directory', name: part, children: [] };
            currentNode.children.push(newDir);
            currentNode = newDir;
        } else {
            currentNode = nextNode;
        }
    }
    return currentNode;
};

const saveFileToFS = (root: FSNode, path: string[], fileName: string, content: string): FSNode => {
    const newRoot = JSON.parse(JSON.stringify(root)) as FSNode;
    if (newRoot.type !== 'directory') return root;

    const directory = findOrCreateDirectoryByPath(newRoot, path);

    const existingFileIndex = directory.children.findIndex(child => child.name === fileName && child.type === 'file');
    if (existingFileIndex > -1) {
        (directory.children[existingFileIndex] as FileNode).content = content;
    } else {
        directory.children.push({ type: 'file', name: fileName, content });
    }
    
    return newRoot;
};

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return debouncedValue;
};


// --- App Components ---

export const NotepadApp: React.FC<Partial<AppProps>> = ({ file, setFs }) => {
    const [content, setContent] = useState(file?.content || '');
    const [currentFile, setCurrentFile] = useState(file);

    const handleSave = () => {
        let fileName = currentFile?.name;
        if (!fileName) {
            fileName = prompt("Save as:", "new_document.txt") || undefined;
            if (!fileName) return;
        }

        if (setFs) {
            setFs(fs => saveFileToFS(fs, [], fileName!, content));
            setCurrentFile({ name: fileName, content });
            alert("File saved!");
        }
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-shrink-0 p-1 bg-gray-200 border-b">
                 <button onClick={handleSave} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-sm text-black">Save</button>
            </div>
            <textarea 
                className="w-full h-full p-2 border-none resize-none focus:outline-none bg-white text-black"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing..."
            />
        </div>
    );
};

export const MaxfraAiBrowserApp: React.FC<Partial<AppProps>> = () => {
    const HOME_PAGE = 'https://www.google.com/webhp?igu=1';
    
    type Tab = {
        id: number;
        url: string;
        title: string;
        inputValue: string;
    };

    const tabIdCounter = useRef(0);

    const createNewTab = (url = HOME_PAGE): Tab => {
        tabIdCounter.current += 1;
        return {
            id: tabIdCounter.current,
            url,
            title: 'New Tab',
            inputValue: url === HOME_PAGE ? '' : url,
        };
    };

    const [tabs, setTabs] = useState<Tab[]>([createNewTab()]);
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});
    
    const activeTab = tabs.find(tab => tab.id === activeTabId);

    const updateActiveTab = (updates: Partial<Tab>) => {
        setTabs(prevTabs => prevTabs.map(tab => 
            tab.id === activeTabId ? { ...tab, ...updates } : tab
        ));
    };
    
    const handleAddTab = () => {
        const newTab = createNewTab();
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
    };

    const handleCloseTab = (e: React.MouseEvent, tabId: number) => {
        e.stopPropagation();
        delete iframeRefs.current[tabId];
        setTabs(prevTabs => {
            const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
            let newTabs = prevTabs.filter(tab => tab.id !== tabId);
    
            if (newTabs.length === 0) {
                newTabs = [createNewTab()];
                setActiveTabId(newTabs[0].id);
            } else if (activeTabId === tabId) {
                const newActiveIndex = Math.max(0, tabIndex - 1);
                setActiveTabId(newTabs[newActiveIndex].id);
            }
            return newTabs;
        });
    };

    const handleSwitchTab = (tabId: number) => setActiveTabId(tabId);

    const handleNavigate = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!activeTab) return;
        let url = activeTab.inputValue.trim();
        if (!url) return;

        const isUrl = url.includes('.') && !url.includes(' ');
        if (isUrl) {
             if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        } else {
            url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
        
        updateActiveTab({ url, inputValue: url });
    };

    useEffect(() => {
        if (!activeTabId) return;
        const activeIframe = iframeRefs.current[activeTabId];
        if (!activeIframe) return;

        const updateTitleAndUrl = () => {
            try {
                const iframe = iframeRefs.current[activeTabId];
                if (!iframe || !iframe.contentWindow) return;

                const currentUrlInIframe = iframe.contentWindow.location.href;
                const currentTitleInIframe = iframe.contentWindow.document.title;

                setTabs(prevTabs => prevTabs.map(tab => {
                    if (tab.id === activeTabId) {
                        const newTitle = (currentTitleInIframe && tab.url !== HOME_PAGE) ? currentTitleInIframe : 'New Tab';
                        const newUrl = (currentUrlInIframe && currentUrlInIframe !== 'about:blank') ? currentUrlInIframe : tab.url;
                        
                        return { ...tab, title: newTitle, url: newUrl, inputValue: newUrl === HOME_PAGE ? '' : newUrl };
                    }
                    return tab;
                }));
            } catch (e) {
                // cross-origin, update title from url
                setTabs(prevTabs => prevTabs.map(tab => {
                    if (tab.id === activeTabId) {
                        try {
                           const domain = new URL(tab.url).hostname;
                           return { ...tab, title: domain };
                        } catch {
                           return tab; // keep old title
                        }
                    }
                    return tab;
                }));
            }
        };

        activeIframe.addEventListener('load', updateTitleAndUrl);
        
        return () => {
            activeIframe.removeEventListener('load', updateTitleAndUrl);
        };
    }, [activeTabId, tabs.length]);

    const handleRefresh = () => iframeRefs.current[activeTabId]?.contentWindow?.location.reload();
    const handleBack = () => iframeRefs.current[activeTabId]?.contentWindow?.history.back();
    const handleForward = () => iframeRefs.current[activeTabId]?.contentWindow?.history.forward();
    const handleHome = () => updateActiveTab({ url: HOME_PAGE, inputValue: '' });

    const NewTabPage = () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white text-black">
        <h1 className="text-8xl font-bold mb-8">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#DB4437]">o</span>
          <span className="text-[#F4B400]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#0F9D58]">l</span>
          <span className="text-[#DB4437]">e</span>
        </h1>
        <form onSubmit={handleNavigate} className="w-full max-w-xl">
          <input
            type="text"
            value={activeTab?.inputValue || ''}
            onChange={e => updateActiveTab({ inputValue: e.target.value })}
            className="w-full px-5 py-3 text-lg rounded-full border-2 border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Google or type a URL"
            autoFocus
          />
        </form>
      </div>
    );
    
    if (!activeTab) {
        return <div className="w-full h-full bg-gray-200">Loading tabs...</div>;
    }

    return (
      <div className="w-full h-full flex flex-col bg-gray-200 text-black">
        <div className="flex-shrink-0 bg-gray-300 flex items-end pt-1">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    onClick={() => handleSwitchTab(tab.id)}
                    className={`flex items-center max-w-[220px] h-9 -mb-px border-t border-l border-r ${activeTabId === tab.id ? 'bg-gray-200 border-gray-400 rounded-t-lg' : 'bg-gray-300 border-transparent hover:bg-gray-400/50 rounded-t-md'}`}
                >
                    <div className="flex items-center pl-3 pr-2 py-2 cursor-pointer grow shrink min-w-0">
                      <span className="truncate text-sm select-none">{tab.title}</span>
                    </div>
                    <button onClick={(e) => handleCloseTab(e, tab.id)} className="p-1 mr-1 rounded-full hover:bg-red-500 hover:text-white shrink-0">
                        {CloseIcon("w-3.5 h-3.5")}
                    </button>
                </div>
            ))}
            <button onClick={handleAddTab} className="p-1 ml-1 mb-1 rounded-md hover:bg-gray-400/50">
                {PlusIcon("w-5 h-5")}
            </button>
        </div>
        <div className="flex-shrink-0 p-1.5 bg-gray-200 flex items-center gap-1 border-b border-gray-300">
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-300 text-gray-700">{ChevronLeftIcon()}</button>
            <button onClick={handleForward} className="p-2 rounded-full hover:bg-gray-300 text-gray-700">{ChevronRightIcon()}</button>
            <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-gray-300 text-gray-700">{ReloadIcon()}</button>
            <button onClick={handleHome} className="p-2 rounded-full hover:bg-gray-300 text-gray-700">{HomeIcon()}</button>
            <form onSubmit={handleNavigate} className="flex-grow">
                <input
                    type="text"
                    value={activeTab?.inputValue || ''}
                    onChange={e => updateActiveTab({ inputValue: e.target.value })}
                    className="w-full px-4 py-1.5 rounded-full border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </form>
        </div>
        <div className="flex-grow relative bg-white">
          {tabs.map(tab => (
            <div key={tab.id} className="w-full h-full" style={{ display: activeTabId === tab.id ? 'block' : 'none' }}>
              {tab.url === HOME_PAGE
                ? <NewTabPage />
                : <iframe
                    ref={el => { if(el) iframeRefs.current[tab.id] = el; }}
                    src={tab.url}
                    className="w-full h-full border-none"
                    title="Browser"
                    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  />
              }
            </div>
          ))}
        </div>
      </div>
    );
};

export const FileExplorerApp: React.FC<Partial<AppProps>> = ({ fs, setFs, openApp }) => {
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    if (!fs || !setFs || !openApp) return <div className="p-4">Loading file system...</div>;
    
    const handleNavigate = (folderName: string) => {
        setSearchQuery('');
        setCurrentPath(prev => [...prev, folderName]);
    };
    const handleBack = () => {
        setSearchQuery('');
        setCurrentPath(prev => prev.slice(0, -1));
    };

    const handleOpenFile = (file: FileNode) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        let fileData: FileData = file;
        let appId: string;

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

        if (extension && imageExtensions.includes(extension)) {
            appId = 'imageViewer';
        } else if (extension === 'doc' || extension === 'docx') {
            appId = 'maxfraOfficeSuite';
            fileData = { ...file, subApp: 'word' };
        } else if (extension === 'xls' || extension === 'xlsx') {
            appId = 'maxfraOfficeSuite';
            fileData = { ...file, subApp: 'excel' };
        } else {
            appId = 'notepad';
        }
        openApp(appId, fileData);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !setFs) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setFs(currentFs => saveFileToFS(currentFs, currentPath, file.name, content));
            }
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Allow uploading the same file again
    };

    const searchResults = useMemo(() => {
        if (!debouncedSearchQuery) return [];
        const results: {node: FSNode, path: string[]}[] = [];
        const search = (directory: DirectoryNode, path: string[]) => {
            for (const child of directory.children) {
                if (child.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
                    results.push({ node: child, path: [...path, directory.name] });
                }
                if (child.type === 'directory') {
                    search(child, [...path, directory.name]);
                }
            }
        };
        const currentDirectory = findNodeByPath(fs, currentPath) || fs as DirectoryNode;
        search(currentDirectory, []);
        return results;
    }, [debouncedSearchQuery, fs, currentPath]);

    const handleSearchResultClick = (result: {node: FSNode, path: string[]}) => {
        if (result.node.type === 'directory') {
            const relativePath = result.path.slice(currentPath.length + 1);
            setCurrentPath([...currentPath, ...relativePath, result.node.name]);
            setSearchQuery('');
        } else {
            handleOpenFile(result.node as FileNode);
        }
    }

    const currentDirectory = findNodeByPath(fs, currentPath) || fs as DirectoryNode;
    const itemsToDisplay = debouncedSearchQuery ? [] : (currentDirectory.type === 'directory' ? currentDirectory.children : []);

    return (
        <div className="w-full h-full flex flex-col bg-white text-black">
            <div className="flex items-center p-2 bg-gray-100 border-b gap-2 flex-wrap">
                <button onClick={handleBack} disabled={currentPath.length === 0} className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50 text-black">Back</button>
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                    {UploadIcon("w-4 h-4")}
                    Upload Image
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*"
                />
                <div className="flex-grow p-2 bg-white border rounded-sm min-w-[200px]">C:\{currentPath.join('\\')}</div>
                <input 
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="p-2 border rounded-sm w-full sm:w-auto text-black"
                />
            </div>
            <div className="flex-grow p-2 overflow-y-auto">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {itemsToDisplay.map(node => (
                        <div key={node.name} className="flex flex-col items-center p-2 rounded hover:bg-blue-100 cursor-pointer"
                            onDoubleClick={() => node.type === 'directory' ? handleNavigate(node.name) : handleOpenFile(node as FileNode)}>
                            {node.type === 'directory' ? FolderIcon() : FileIcon()}
                            <span className="text-xs mt-1 text-center break-all">{node.name}</span>
                        </div>
                    ))}
                     {searchResults.map((result, index) => (
                        <div key={`${result.node.name}-${index}`} className="flex flex-col items-center p-2 rounded hover:bg-green-100 cursor-pointer"
                            onDoubleClick={() => handleSearchResultClick(result)}>
                            {result.node.type === 'directory' ? FolderIcon() : FileIcon()}
                            <span className="text-xs mt-1 text-center break-all">{result.node.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const SettingsApp: React.FC<Partial<AppProps>> = () => {
    const [currentBg, setCurrentBg] = useState(() => {
        try { return localStorage.getItem('maxfra-os-background') || 'default' }
        catch { return 'default' }
    });

    const handleBgChange = (bgId: string) => {
        try {
            localStorage.setItem('maxfra-os-background', bgId);
            setCurrentBg(bgId);
            window.dispatchEvent(new StorageEvent('storage', { key: 'maxfra-os-background', newValue: bgId }));
        } catch (e) {
            console.error("Could not set background in localStorage", e);
        }
    };
    const backgrounds = { default: 'Default Blue', sunset: 'Sunset', matrix: 'Matrix' };
    return <div className="p-6 text-black"><h3 className="text-2xl font-bold mb-4">Background</h3><div className="grid grid-cols-3 gap-4">{Object.entries(backgrounds).map(([id, name]) => <div key={id}><button onClick={() => handleBgChange(id)} className={`w-full h-24 rounded border-4 ${currentBg === id ? 'border-blue-500' : 'border-transparent'}`} style={{background: `var(--bg-${id})`}}/> <p className="text-center mt-2">{name}</p></div>)}</div><div className="mt-12 p-4 bg-gray-100 rounded-lg"><h4 className="font-bold">About</h4><p className="text-sm">Maxfra Academy OS - (c) Patrick Blanks - All Rights reserved.</p></div></div>;
};

// --- Shared Components ---
const SignaturePad = React.forwardRef<HTMLCanvasElement, { width: number, height: number, onEnd: (dataUrl: string) => void, initialData?: string }>(({ width, height, onEnd, initialData }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);
    
    const isDrawing = useRef(false);
    const lastPos = useRef<{x: number, y: number} | null>(null);
    
    const getPos = (e: MouseEvent | TouchEvent) => {
        const canvas = internalRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    const draw = (e: MouseEvent | TouchEvent) => {
        e.preventDefault(); // Prevent scrolling on touch devices
        if (!isDrawing.current) return;
        const canvas = internalRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        
        const pos = getPos(e);
        if (pos && lastPos.current) {
            ctx.beginPath();
            ctx.moveTo(lastPos.current.x, lastPos.current.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastPos.current = pos;
        }
    }
    
    const startDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        isDrawing.current = true;
        lastPos.current = getPos(e);
    };

    const stopDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        isDrawing.current = false;
        lastPos.current = null;
        if (internalRef.current) {
            onEnd(internalRef.current.toDataURL());
        }
    };
    
    useEffect(() => {
        const canvas = internalRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if(initialData) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0);
            img.src = initialData;
        }

        canvas.addEventListener('mousedown', startDrawing, { passive: false });
        canvas.addEventListener('mousemove', draw, { passive: false });
        canvas.addEventListener('mouseup', stopDrawing, { passive: false });
        canvas.addEventListener('mouseleave', stopDrawing, { passive: false });
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [initialData]);
    
    return <canvas ref={internalRef} width={width} height={height} className="bg-gray-100 border border-gray-400 rounded-md touch-none" />;
});


// --- Calendar / Appointment Book App ---

const APPOINTMENTS_FILE_PATH = ['system'];
const APPOINTMENTS_FILE_NAME = 'maxfra-appointments.json';
const STUDENTS_FILE_NAME = 'maxfra-students.json';
const CHECK_IN_LOG_FILE_NAME = 'maxfra-check-in-log.json';
const TRANSACTIONS_FILE_NAME = 'maxfra-transactions.json';


const LOCATIONS = ['Perisur', 'Cd Brisas', 'Polanco'] as const;
const TEACHERS = ['Fernando', 'Maggi', 'Rosi'] as const;
const COURSES = ['Microblading', 'Eyelash Extensions', 'Hena', 'Lash Lifting'] as const;
const SPECIALS = ['Pickup Diploma', 'Information'] as const;
const COURSE_CAPACITY = 4;
type Location = typeof LOCATIONS[number];
type Teacher = typeof TEACHERS[number];
type Course = typeof COURSES[number];
type Special = typeof SPECIALS[number];
type CalendarView = 'Daily' | 'Weekly' | 'Monthly';


interface GroupedAppointment {
    id: string;
    location: Location;
    date: string;
    time: string;
    details: string;
    type: 'Course' | 'Special';
    students: Appointment[];
    teacher: Teacher;
}

const formatDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const QRCode = ({ data, size = 128 }: { data: string, size?: number }) => {
    if (!data) return null;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=${size}x${size}&bgcolor=ffffff&qzone=1`;
    return <img src={qrUrl} alt="QR Code" width={size} height={size} className="border" />;
};

const AppointmentDetailModal = ({ appointmentGroup, studentsById, onClose, onUpdateAppointment, onDeleteAppointmentGroup, onPrintSave }: { appointmentGroup: GroupedAppointment, studentsById: Record<string, Student>, onClose: () => void, onUpdateAppointment: (app: Appointment) => void, onDeleteAppointmentGroup: (groupId: string) => void, onPrintSave: (group: GroupedAppointment) => void }) => {
    const [signingAppointment, setSigningAppointment] = useState<Appointment | null>(null);

    const StudentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
        const student = appointment.studentId ? studentsById[appointment.studentId] : undefined;
        const [learningLog, setLearningLog] = useState(appointment.learningLog || '');

        const handleAttendance = (attendance: 'Pending' | 'Present' | 'Absent') => {
            onUpdateAppointment({ ...appointment, attendance });
        };
        const handleSaveLog = () => {
            onUpdateAppointment({ ...appointment, learningLog });
            alert('Learning log saved!');
        };

        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-lg">{appointment.studentName}</h4>
                        <p className="text-sm text-gray-500 italic">{student ? `ID: ${student.id} | Tel: ${student.mobilePhone}` : 'Manual entry'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSigningAppointment(appointment)} className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Signature</button>
                    </div>
                </div>
                {appointment.signature && <img src={appointment.signature} alt="Signature" className="mt-2 border rounded-md h-16 bg-white" />}
                
                <div className="mt-3 border-t pt-3 space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500">Attendance</label>
                        <div className="flex gap-2 mt-1">
                            {(['Present', 'Absent', 'Pending'] as const).map(status => (
                                <button key={status} onClick={() => handleAttendance(status)} className={`px-3 py-1 text-sm rounded-full ${appointment.attendance === status ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{status}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500">What was learned today?</label>
                        <textarea value={learningLog} onChange={(e) => setLearningLog(e.target.value)} className="w-full p-2 border rounded mt-1 text-sm h-20" placeholder="e.g., Practiced basic strokes on latex..."/>
                        <button onClick={handleSaveLog} className="px-3 py-1 bg-blue-500 text-white rounded text-sm mt-1">Save Notes</button>
                    </div>
                </div>
            </div>
        );
    };
    
    const SignatureModal = ({ appointment, onSave, onCancel }: { appointment: Appointment, onSave: (app: Appointment, signature: string) => void, onCancel: () => void }) => (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={onCancel}>
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">Signature for {appointment.studentName}</h3>
                <SignaturePad width={400} height={200} initialData={appointment.signature} onEnd={(sig) => onSave(appointment, sig)} />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Done</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-3xl shadow-2xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start flex-shrink-0 border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{appointmentGroup.details}</h2>
                        <p className="text-gray-500">{appointmentGroup.type} with {appointmentGroup.teacher}</p>
                        <p className="text-gray-500">{appointmentGroup.location} @ {appointmentGroup.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onPrintSave(appointmentGroup)} className="p-2 rounded-full hover:bg-gray-200" title="Print/Save">{ShareIcon()}</button>
                         <button onClick={() => { if(window.confirm('Are you sure you want to delete this entire appointment group?')) onDeleteAppointmentGroup(appointmentGroup.id) }} className="p-2 rounded-full hover:bg-red-100" title="Delete Appointment">{TrashIcon("text-red-500")}</button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                            {CloseIcon("w-5 h-5")}
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    <h3 className="font-semibold text-lg mb-3">Attendees ({appointmentGroup.students.length}/{appointmentGroup.type === 'Course' ? COURSE_CAPACITY : 'N/A'})</h3>
                    <div className="space-y-4">
                        {appointmentGroup.students.map(app => <StudentCard key={app.id} appointment={app} />)}
                    </div>
                </div>
            </div>
            {signingAppointment && <SignatureModal appointment={signingAppointment} onCancel={() => setSigningAppointment(null)} onSave={(app, sig) => { onUpdateAppointment({ ...app, signature: sig }); setSigningAppointment(null); }}/>}
        </div>
    );
};

const AppointmentConfirmationModal = ({ appointment, onClose }: { appointment: Appointment, onClose: () => void }) => {
    const confirmationNumber = `MAXFRA-${appointment.id.slice(-6).toUpperCase()}`;

    const handleDownload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loadImg = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        const logoImg = await loadImg(MAXFRA_LOGO_B64);

        canvas.width = 400;
        canvas.height = 350;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.drawImage(logoImg, 20, 20, 50, 50);
        ctx.fillStyle = '#1a202c';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Appointment Confirmed', canvas.width - 20, 50);

        // Details
        ctx.textAlign = 'left';
        let y = 100;
        const drawLine = (label: string, value: string) => {
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(label, 20, y);
            ctx.font = '14px sans-serif';
            ctx.fillText(value, 130, y);
            y += 25;
        };

        drawLine('Student:', appointment.studentName);
        drawLine('Service:', appointment.details);
        drawLine('Date:', new Date(appointment.date + 'T12:00:00').toLocaleDateString('en-CA'));
        drawLine('Time:', appointment.time);
        drawLine('Location:', appointment.location);
        drawLine('Teacher:', appointment.teacher);
        drawLine('Confirmation #:', confirmationNumber);

        const link = document.createElement('a');
        link.download = `appointment_confirmation_${appointment.studentName.replace(' ', '_')}.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
    };
    
    const handleShareWhatsApp = () => {
        const message = `*Maxfra Academy Appointment Confirmation*\n\n` +
                        `Hello ${appointment.studentName}! Your appointment is confirmed.\n\n` +
                        `*Details:*\n` +
                        `*Service:* ${appointment.details}\n` +
                        `*Date:* ${new Date(appointment.date + 'T12:00:00').toLocaleDateString('en-CA')}\n` +
                        `*Time:* ${appointment.time}\n` +
                        `*Location:* ${appointment.location}\n` +
                        `*Teacher:* ${appointment.teacher}\n` +
                        `*Confirmation #:* ${confirmationNumber}\n\n` +
                        `We look forward to seeing you!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800">Appointment Confirmed!</h2>
                    <button onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-200">{CloseIcon()}</button>
                </div>
                <div className="mt-4 border-t pt-4 space-y-2 text-gray-700">
                    <p><strong>Student:</strong> {appointment.studentName}</p>
                    <p><strong>Service:</strong> {appointment.details}</p>
                    <p><strong>Date:</strong> {new Date(appointment.date + 'T12:00:00').toLocaleDateString('en-CA')} at {appointment.time}</p>
                    <p><strong>Confirmation #:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{confirmationNumber}</span></p>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                     <button onClick={handleDownload} className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                         {ShareIcon("w-5 h-5")} Download Confirmation
                     </button>
                     <button onClick={handleShareWhatsApp} className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                         {WhatsAppIcon("w-6 h-6")} Share on WhatsApp
                     </button>
                     <button onClick={onClose} className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition mt-2">
                         Done
                     </button>
                </div>
            </div>
        </div>
    );
};

// --- Calendar View Components ---

const DailyView = React.memo(({ groupedAppointments, onAppointmentClick, onExport }: { groupedAppointments: GroupedAppointment[], onAppointmentClick: (app: GroupedAppointment) => void, onExport: (location: Location) => void }) => {
    const timeSlots = Array.from({ length: 11 }, (_, i) => `${i + 10}:00`);

    return (
        <div className="bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="w-24 p-3 font-semibold text-left text-gray-600 border-b border-r">Time</th>
                        {LOCATIONS.map((loc, index) => (
                             <th key={loc} className={`p-3 font-semibold text-left text-gray-600 border-b relative group ${index < LOCATIONS.length - 1 ? 'border-r' : ''}`}>
                                <span>{loc}</span>
                                <button onClick={() => onExport(loc)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 hover:bg-gray-300 transition-opacity" title={`Export ${loc} schedule`}>
                                    {ShareIcon("w-4 h-4 text-gray-600")}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map(time => (
                        <tr key={time} className="h-32">
                            <td className="p-2 align-top text-right font-mono text-gray-500 border-b border-r">
                                {time}
                            </td>
                            {LOCATIONS.map((location, index) => {
                                const apps = groupedAppointments.filter(a => a.location === location && a.time === time);
                                return (
                                    <td key={location} className={`p-1.5 align-top border-b relative ${index < LOCATIONS.length - 1 ? 'border-r' : ''}`}>
                                        <div className="space-y-1.5">
                                        {apps.map(app => (
                                            <div key={app.id} onClick={() => onAppointmentClick(app)} className={`p-2 rounded-md cursor-pointer hover:shadow-lg transition-shadow ${app.type === 'Course' ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
                                                <p className="font-bold text-gray-800">{app.details}</p>
                                                <p className="text-xs text-gray-600">{app.teacher}</p>
                                                <p className="text-xs text-gray-500 truncate mt-1">{app.students.map(s => s.studentName).join(', ')}</p>
                                            </div>
                                        ))}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

const WeeklyView = React.memo(({ currentDate, groupedAppointments, onAppointmentClick }: { currentDate: Date, groupedAppointments: GroupedAppointment[], onAppointmentClick: (app: GroupedAppointment) => void }) => {
    const weekDays: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDays.push(day);
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-7">
                {weekDays.map((day, index) => (
                    <div key={day.toISOString()} className={`border-r ${index === 6 ? 'border-r-0' : ''}`}>
                        <div className="text-center p-2 border-b bg-gray-50">
                            <p className="text-sm font-semibold text-gray-600">{day.toLocaleDateString('default', { weekday: 'short' })}</p>
                            <p className="text-2xl font-bold text-gray-800">{day.getDate()}</p>
                        </div>
                        <div className="p-2 space-y-2 h-[60vh] overflow-y-auto">
                            {groupedAppointments.filter(a => a.date === formatDateKey(day)).sort((a, b) => a.time.localeCompare(b.time)).map(app => (
                                <div key={app.id} onClick={() => onAppointmentClick(app)} className={`p-2 rounded-md cursor-pointer hover:shadow ${app.type === 'Course' ? 'bg-blue-50 border-blue-400' : 'bg-green-50 border-green-400'} border`}>
                                    <p className="font-semibold text-xs text-gray-800">{app.time} - {app.details}</p>
                                    <p className="text-xs text-gray-500">{app.location}</p>
                                    <p className="text-xs text-gray-500 truncate">{app.students.map(s => s.studentName).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

const MonthlyView = React.memo(({ currentDate, appointmentsByDate, onDateClick }: { currentDate: Date, appointmentsByDate: Record<string, Appointment[]>, onDateClick: (date: Date) => void }) => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];
    const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday is 0

    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    
    const today = new Date();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="border rounded-md h-28"></div>;
                    
                    const dateKey = formatDateKey(day);
                    const isToday = formatDateKey(today) === dateKey;
                    const appointments = appointmentsByDate[dateKey] || [];

                    return (
                        <div key={dateKey} onClick={() => onDateClick(day)} className="border rounded-md h-28 p-1.5 flex flex-col cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className={`font-bold ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{day.getDate()}</span>
                            {appointments.length > 0 && 
                                <div className="mt-auto text-xs bg-gray-200 text-gray-700 font-semibold text-center rounded-full px-2 py-0.5 self-center">
                                    {appointments.length} event{appointments.length > 1 ? 's' : ''}
                                </div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
});


export const CalendarApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('Daily');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingAppointmentId, setViewingAppointmentId] = useState<string | null>(null);
    const [confirmationData, setConfirmationData] = useState<Appointment | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true); // To prevent saving on first load

    // --- Data Loading Effect ---
    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        let loadedStudents: Student[] = [];
        if (studentsFile) {
            try { 
                const parsedStudents = JSON.parse(studentsFile.content);
                if (Array.isArray(parsedStudents)) loadedStudents = parsedStudents;
            } 
            catch (e) { console.error("Failed to parse students file", e); }
        }
        setStudents(loadedStudents);

        const appointmentsFile = dir?.children.find(f => f.name === APPOINTMENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (appointmentsFile) {
            try { 
                const loadedAppointments = JSON.parse(appointmentsFile.content);
                if (Array.isArray(loadedAppointments)) {
                    const tempStudentsById = loadedStudents.reduce((acc, student) => ({ ...acc, [student.id]: student }), {} as Record<string, Student>);
                    const migratedAppointments = loadedAppointments.map((app: any) => {
                        if (!app.studentName && app.studentId && tempStudentsById[app.studentId]) {
                            const student = tempStudentsById[app.studentId];
                            return { ...app, studentName: `${student.firstName} ${student.paternalLastName}` };
                        }
                        if(!app.studentName && !app.studentId) return {...app, studentName: 'Unknown Student'}
                        return app;
                    });
                    setAppointments(migratedAppointments);
                }
            } 
            catch (e) { console.error("Failed to parse appointments file", e); }
        }
    }, [fs]);

    // --- Data Saving Effect ---
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!setFs) return;
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, APPOINTMENTS_FILE_NAME, JSON.stringify(appointments, null, 2)));
    }, [appointments, setFs]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const studentsById = useMemo(() => students.reduce((acc, student) => ({ ...acc, [student.id]: student }), {} as Record<string, Student>), [students]);
    
    const appointmentsByDate = useMemo(() => appointments.reduce((acc, curr) => { (acc[curr.date] = acc[curr.date] || []).push(curr); return acc; }, {} as Record<string, Appointment[]>), [appointments]);

    const groupedAppointments = useMemo(() => {
        const relevantAppointments = view === 'Daily' ? appointmentsByDate[formatDateKey(currentDate)] || [] : appointments;
        const grouped = relevantAppointments.reduce((acc, curr) => {
            const key = `${curr.location}-${curr.time}-${curr.teacher}-${curr.details}`;
            if (!acc[key]) {
                acc[key] = {
                    id: key, location: curr.location, date: curr.date, time: curr.time,
                    details: curr.details, type: curr.type, teacher: curr.teacher,
                    students: [],
                };
            }
            acc[key].students.push(curr);
            return acc;
        }, {} as Record<string, GroupedAppointment>);
        return Object.values(grouped);
    }, [currentDate, appointmentsByDate, view]);
    
    const viewingAppointment = useMemo(() => groupedAppointments.find(g => g.id === viewingAppointmentId), [groupedAppointments, viewingAppointmentId]);
    
    const handleSaveNewAppointment = useCallback((newAppointment: Appointment) => {
        setAppointments(prev => [...prev, newAppointment]);
        setIsModalOpen(false);
        setConfirmationData(newAppointment);
    }, []);

    const handleUpdateAppointment = useCallback((updatedApp: Appointment) => {
        setAppointments(prevApps => prevApps.map(app => app.id === updatedApp.id ? updatedApp : app));
    }, []);

    const handleDeleteAppointmentGroup = useCallback((groupId: string) => {
        const groupToDelete = groupedAppointments.find(g => g.id === groupId);
        if(!groupToDelete) return;
        const appointmentIdsToDelete = new Set(groupToDelete.students.map(s => s.id));
        setAppointments(prevApps => prevApps.filter(app => !appointmentIdsToDelete.has(app.id)));
        setViewingAppointmentId(null);
        alert('Appointment deleted.');
    }, [groupedAppointments]);

    const handlePrintSaveAppointment = useCallback(async (group: GroupedAppointment) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
    
        const loadImg = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    
        const logoImg = await loadImg(MAXFRA_LOGO_B64);
        
        let totalHeight = 160; // Initial padding and header
        const studentCardHeight = 120; // Estimated height per student
        totalHeight += group.students.length * studentCardHeight;

        canvas.width = 600;
        canvas.height = totalHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.drawImage(logoImg, 20, 20, 60, 60);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Appointment Summary', 580, 55);
        ctx.font = '16px sans-serif';
        ctx.fillText(new Date(group.date + 'T12:00:00').toLocaleDateString('en-CA'), 580, 80);

        // Details
        let y = 120;
        ctx.textAlign = 'left';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`${group.details} (${group.type})`, 20, y);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#555';
        ctx.fillText(`${group.location} @ ${group.time} with ${group.teacher}`, 20, y + 20);
        y += 40;

        for (const studentApp of group.students) {
            ctx.fillStyle = 'black';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(studentApp.studentName, 20, y + 25);
            ctx.font = '14px sans-serif';
            ctx.fillStyle = '#555';
            ctx.fillText(`Status: ${studentApp.attendance || 'Pending'}`, 20, y + 45);

            if(studentApp.signature) {
                try {
                    const sigImg = await loadImg(studentApp.signature);
                    ctx.drawImage(sigImg, 20, y + 55, 120, 30);
                } catch (e) { console.error('could not load signature'); }
            }
            y += studentCardHeight;
        }

        const link = document.createElement('a');
        link.download = `appointment_${group.date}_${group.time}.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();

    }, []);

    const handleExportLocationSchedule = useCallback((location: Location) => {
        const appointmentsToExport = groupedAppointments.filter(app => app.location === location && app.date === formatDateKey(currentDate)).sort((a, b) => a.time.localeCompare(b.time));
        if (appointmentsToExport.length === 0) return alert(`No appointments for ${location}.`);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const padding = 40, lineHeight = 22, contentWidth = 600;
        let yPos = padding;
        let totalHeight = padding * 2 + 80;
        appointmentsToExport.forEach(appGroup => {
            totalHeight += lineHeight * 2.5;
            const studentNames = appGroup.students.map(s => s.studentName).join(', ');
            ctx.font = '14px sans-serif';
            const studentLines = Math.ceil(ctx.measureText(`Attendees: ${studentNames}`).width / (contentWidth - 20));
            totalHeight += (studentLines * lineHeight * 0.8) + (lineHeight);
        });
        canvas.width = contentWidth + padding * 2; canvas.height = totalHeight;
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const logoImg = new Image();
        logoImg.onload = () => {
            ctx.drawImage(logoImg, padding, yPos, 60, 60);
            ctx.fillStyle = '#1f2937'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(`Maxfra Schedule - ${location}`, canvas.width - padding, yPos + 38);
            ctx.font = '18px sans-serif';
            ctx.fillText(currentDate.toLocaleDateString('en-CA'), canvas.width - padding, yPos + 65);
            yPos += 100;
            ctx.textAlign = 'left';
            appointmentsToExport.forEach(appGroup => {
                ctx.fillStyle = '#4b5563';
                ctx.fillRect(padding, yPos - (lineHeight/2) - 3, canvas.width - (padding*2), 1);
                ctx.font = 'bold 18px sans-serif'; ctx.fillStyle = '#1f2937';
                ctx.fillText(`${appGroup.time} - ${appGroup.details}`, padding, yPos + lineHeight);
                ctx.font = '16px sans-serif'; ctx.fillStyle = '#6b7280';
                ctx.fillText(`with ${appGroup.teacher}`, padding + 15, yPos + lineHeight * 2);
                ctx.fillText(`Attendees: ${appGroup.students.map(s => s.studentName).join(', ')}`, padding + 15, yPos + lineHeight * 3);
                yPos += lineHeight * 4.5;
            });
            const link = document.createElement('a');
            link.download = `maxfra_schedule_${location}_${formatDateKey(currentDate)}.png`;
            link.href = canvas.toDataURL('image/png'); link.click();
        };
        logoImg.src = MAXFRA_LOGO_B64;
    }, [groupedAppointments, currentDate]);

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return appointments.filter(app => (app.studentName || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10);
    }, [searchQuery, appointments]);

    const changeDate = (offset: number) => {
        setCurrentDate(d => {
            const newDate = new Date(d);
            if (view === 'Daily') newDate.setDate(d.getDate() + offset);
            else if (view === 'Weekly') newDate.setDate(d.getDate() + offset * 7);
            else if (view === 'Monthly') newDate.setMonth(d.getMonth() + offset);
            return newDate;
        });
    };

    const getHeaderTitle = () => {
        if (view === 'Monthly') return currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        if (view === 'Weekly') {
            const start = new Date(currentDate);
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            if (start.getMonth() === end.getMonth()) return `${start.getDate()} - ${end.getDate()}, ${end.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
            return `${start.toLocaleDateString('default', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
        return currentDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    
    const generateWhatsAppMessage = () => {
        let text = `*Maxfra Appointments*\n*${currentDate.toLocaleDateString('en-CA')}*\n\n`;
        LOCATIONS.forEach(location => {
            const locationAppointments = groupedAppointments.filter(a => a.location === location && a.date === formatDateKey(currentDate));
            if (locationAppointments.length > 0) {
                text += `*📍 ${location}*\n`;
                locationAppointments.sort((a,b) => a.time.localeCompare(b.time)).forEach(appGroup => {
                    text += `    - ${appGroup.time}: ${appGroup.details} (${appGroup.students.map(s => s.studentName).join(', ')})\n`;
                });
                text += `\n`;
            }
        });
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black text-sm select-none font-sans">
            <header className="flex-shrink-0 p-3 bg-white border-b flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4 w-1/3">
                     <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">New Appointment</button>
                    <div className="flex bg-gray-200 rounded-lg p-1">
                        {(['Daily', 'Weekly', 'Monthly'] as CalendarView[]).map(v => (
                            <button key={v} onClick={() => setView(v)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === v ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}>{v}</button>
                        ))}
                    </div>
                     <button onClick={generateWhatsAppMessage} className="p-2 rounded-full hover:bg-gray-200" title="Share on WhatsApp">
                        {WhatsAppIcon("w-6 h-6 text-green-500")}
                    </button>
                </div>
                <div className="flex items-center gap-2 justify-center w-1/3">
                     <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-gray-200">{ChevronLeftIcon()}</button>
                     <span className="font-bold text-lg w-auto min-w-[280px] text-center text-gray-700">{getHeaderTitle()}</span>
                     <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-gray-200">{ChevronRightIcon()}</button>
                </div>
                <div className="w-1/3 flex justify-end">
                    <div className="relative w-64" ref={searchRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> {SearchIcon("text-gray-400")} </div>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setShowSearchResults(true)} placeholder="Search by student name..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:bg-white focus:ring-2"/>
                        {showSearchResults && searchResults.length > 0 && (
                             <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-xl z-10 max-h-80 overflow-y-auto">
                                {searchResults.map((app) => (
                                    <div key={app.id} onClick={() => { setCurrentDate(new Date(app.date + 'T12:00:00')); setView('Daily'); setShowSearchResults(false); setSearchQuery(''); }} className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                                        <p className="font-semibold">{app.studentName}</p>
                                        <p className="text-xs text-gray-500">{app.date} @ {app.time} - {app.details}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
            </header>
            <main className="flex-grow p-4 overflow-auto">
                {view === 'Daily' && <DailyView groupedAppointments={groupedAppointments} onAppointmentClick={(group) => setViewingAppointmentId(group.id)} onExport={handleExportLocationSchedule} />}
                {view === 'Weekly' && <WeeklyView currentDate={currentDate} groupedAppointments={groupedAppointments} onAppointmentClick={(group) => setViewingAppointmentId(group.id)} />}
                {view === 'Monthly' && <MonthlyView currentDate={currentDate} appointmentsByDate={appointmentsByDate} onDateClick={date => { setCurrentDate(date); setView('Daily'); }} />}
            </main>
            {isModalOpen && <AppointmentModal onClose={() => setIsModalOpen(false)} onSave={handleSaveNewAppointment} appointments={appointments} students={students} date={currentDate} />}
            {viewingAppointment && <AppointmentDetailModal appointmentGroup={viewingAppointment} studentsById={studentsById} onClose={() => setViewingAppointmentId(null)} onUpdateAppointment={handleUpdateAppointment} onDeleteAppointmentGroup={handleDeleteAppointmentGroup} onPrintSave={handlePrintSaveAppointment}/>}
            {confirmationData && <AppointmentConfirmationModal appointment={confirmationData} onClose={() => setConfirmationData(null)} />}
        </div>
    );
};

const AppointmentModal = ({ onClose, onSave, appointments, students, date }: { onClose: () => void, onSave: (app: Appointment) => void, appointments: Appointment[], students: Student[], date: Date }) => {
    const [entryType, setEntryType] = useState<'database' | 'manual'>('database');
    
    const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
        studentId: students[0]?.id || '',
        studentName: students.length > 0 ? `${students[0].firstName} ${students[0].paternalLastName}` : '',
        location: LOCATIONS[0],
        type: 'Course',
        details: COURSES[0],
        teacher: TEACHERS[0],
        date: formatDateKey(date),
        time: '10:00',
        attendance: 'Pending',
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.studentName) {
            alert("Please select or enter a student name.");
            return;
        }

        const appDate = new Date(`${formData.date}T00:00:00`);
        const dayOfWeek = appDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 1) { // Sunday or Monday
            alert("Appointments can only be booked from Tuesday to Saturday.");
            return;
        }

        if (formData.type === 'Course') {
            const existing = appointments.filter(a => a.location === formData.location && a.date === formData.date && a.time === formData.time && a.teacher === formData.teacher && a.details === formData.details).length;
            if (existing >= COURSE_CAPACITY) {
                alert(`This course slot is full (${existing}/${COURSE_CAPACITY}).`);
                return;
            }
        }
        
        const newAppointment: Appointment = { id: Date.now().toString(), ...formData };
        onSave(newAppointment);
    };

    const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedStudent = students.find(s => s.id === selectedId);
        if (selectedStudent) {
            setFormData({ ...formData, studentId: selectedId, studentName: `${selectedStudent.firstName} ${selectedStudent.paternalLastName}`});
        }
    }
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, studentId: '', studentName: e.target.value });
    }

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'Course' | 'Special';
        const newDetailOptions = newType === 'Course' ? COURSES : SPECIALS;
        setFormData(prev => ({
            ...prev,
            type: newType,
            details: newDetailOptions[0],
        }));
    };

    const detailOptions = formData.type === 'Course' ? COURSES : SPECIALS;

    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">New Appointment</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="flex bg-gray-200 rounded-lg p-1">
                        <button type="button" onClick={() => setEntryType('database')} className={`w-1/2 p-2 rounded-md font-semibold text-center transition ${entryType === 'database' ? 'bg-white shadow' : 'text-gray-600'}`}>From Database</button>
                        <button type="button" onClick={() => setEntryType('manual')} className={`w-1/2 p-2 rounded-md font-semibold text-center transition ${entryType === 'manual' ? 'bg-white shadow' : 'text-gray-600'}`}>Manual Entry</button>
                    </div>

                    {entryType === 'database' ? (
                        <select value={formData.studentId} onChange={handleStudentSelect} required className="w-full p-2 border rounded">
                            <option value="" disabled>Select a student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.paternalLastName}</option>)}
                        </select>
                    ) : (
                        <input type="text" value={formData.studentName} onChange={handleNameChange} placeholder="Enter student's full name" required className="w-full p-2 border rounded" />
                    )}

                    <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value as any})} className="w-full p-2 border rounded">{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select>
                    <select value={formData.type} onChange={handleTypeChange} className="w-full p-2 border rounded"><option value="Course">Course</option><option value="Special">Special</option></select>
                    <select value={formData.details} onChange={e => setFormData({...formData, details: e.target.value as any})} className="w-full p-2 border rounded">{detailOptions.map(d => <option key={d} value={d}>{d}</option>)}</select>
                    <select value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value as any})} className="w-full p-2 border rounded">{TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}</select>
                    <div className="flex gap-4">
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="w-1/2 p-2 border rounded" />
                        <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required min="10:00" max="20:00" step="3600" className="w-1/2 p-2 border rounded" />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Finance Calculator App ---
export const CalculatorApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [showLogForm, setShowLogForm] = useState(false);
    const [logDescription, setLogDescription] = useState('');
    const [logType, setLogType] = useState<'income' | 'expense'>('income');
    const [linkToStudent, setLinkToStudent] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const formatCurrency = useCallback((value: number | string) => {
        const number = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(number)) return '$0.00 MXN';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(number);
    }, []);

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        
        const transactionsFile = dir?.children.find(f => f.name === TRANSACTIONS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (transactionsFile) {
            try {
                const parsed = JSON.parse(transactionsFile.content);
                if (Array.isArray(parsed)) setTransactions(parsed);
            } catch { console.error("Failed to parse transactions file"); }
        }
        
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (studentsFile) {
            try {
                const parsed = JSON.parse(studentsFile.content);
                if(Array.isArray(parsed)) setStudents(parsed);
            } catch { console.error("Failed to parse students file"); }
        }

    }, [fs]);
    
    const saveTransactions = useCallback((newTransactions: Transaction[]) => {
        if (!setFs) return;
        setTransactions(newTransactions);
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, TRANSACTIONS_FILE_NAME, JSON.stringify(newTransactions, null, 2)));
    }, [setFs]);

    const handleDigitClick = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplayValue(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
        }
    };
    
    const handleDecimalClick = () => {
        if (!displayValue.includes('.')) {
            setDisplayValue(displayValue + '.');
        }
    };

    const handleClearClick = () => {
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const handleToggleSign = () => {
        setDisplayValue(prev => {
            if (prev === '0') return '0';
            return prev.startsWith('-') ? prev.substring(1) : '-' + prev;
        });
    };

    const handlePercent = () => {
        const currentValue = parseFloat(displayValue);
        if (!isNaN(currentValue)) {
            setDisplayValue(String(currentValue / 100));
        }
    };
    
    const performCalculation = {
        '/': (first: number, second: number) => first / second,
        '*': (first: number, second: number) => first * second,
        '+': (first: number, second: number) => first + second,
        '-': (first: number, second: number) => first - second,
        '=': (first: number, second: number) => second,
    };

    const handleOperatorClick = (nextOperator: string) => {
        const inputValue = parseFloat(displayValue);
        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation[operator as keyof typeof performCalculation](firstOperand, inputValue);
            setDisplayValue(String(result));
            setFirstOperand(result);
        }
        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const handleSaveTransaction = () => {
        if (!logDescription) {
            alert("Please enter a description.");
            return;
        }
        const amount = parseFloat(displayValue);
        if (isNaN(amount) || amount === 0) {
            alert("Invalid amount to log.");
            return;
        }

        const student = students.find(s => s.id === selectedStudentId);

        const newTransaction: Transaction = {
            id: `trans-${Date.now()}`,
            date: new Date().toISOString(),
            description: logDescription,
            amount: amount,
            type: logType,
            ...(linkToStudent && student ? { studentId: student.id, studentName: `${student.firstName} ${student.paternalLastName}` } : {})
        };
        saveTransactions([...transactions, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        setShowLogForm(false);
        setLogDescription('');
        setLinkToStudent(false);
        setSelectedStudentId('');
        handleClearClick();
    };

    const balance = useMemo(() => {
        return transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
    }, [transactions]);
    
    const CalculatorButton = ({ onClick, label, className = '' }: { onClick: () => void, label: string, className?: string }) => (
        <button onClick={onClick} className={`bg-gray-200 hover:bg-gray-300 text-2xl font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}>
            {label}
        </button>
    );

    const LogTransactionForm = () => (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-sm">
                <h3 className="text-xl font-bold mb-4">Log Transaction</h3>
                <p className="mb-2">Amount: <span className="font-bold">{formatCurrency(displayValue)}</span></p>
                <input type="text" value={logDescription} onChange={e => setLogDescription(e.target.value)} placeholder="Description (e.g., Course Payment)" className="w-full p-2 border rounded mb-3"/>
                <div className="flex bg-gray-200 rounded-lg p-1 mb-4">
                    <button onClick={() => setLogType('income')} className={`w-1/2 p-2 rounded-md font-semibold text-center transition ${logType === 'income' ? 'bg-green-500 text-white shadow' : 'text-gray-600'}`}>Income</button>
                    <button onClick={() => setLogType('expense')} className={`w-1/2 p-2 rounded-md font-semibold text-center transition ${logType === 'expense' ? 'bg-red-500 text-white shadow' : 'text-gray-600'}`}>Expense</button>
                </div>
                 <div className="mt-3">
                    <label className="flex items-center">
                        <input type="checkbox" checked={linkToStudent} onChange={e => setLinkToStudent(e.target.checked)} className="h-4 w-4 rounded" />
                        <span className="ml-2 text-sm">Link to a student profile?</span>
                    </label>
                    {linkToStudent && (
                        <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="w-full p-2 border rounded mt-2">
                            <option value="">Select a student...</option>
                            {students.sort((a,b) => a.firstName.localeCompare(b.firstName)).map(s => <option key={s.id} value={s.id}>{s.firstName} {s.paternalLastName}</option>)}
                        </select>
                    )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowLogForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSaveTransaction} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex bg-gray-100 text-black font-sans relative">
            {showLogForm && LogTransactionForm()}
            <div className="w-2/3 flex flex-col p-4">
                <div className="w-full bg-gray-800 text-white text-right rounded-t-lg p-4 overflow-hidden">
                    <span className="text-5xl font-light tracking-wider break-all">{displayValue}</span>
                </div>
                <div className="flex-grow grid grid-cols-4 grid-rows-5 gap-2 p-4 bg-white rounded-b-lg shadow-inner">
                    {CalculatorButton({ onClick: handleClearClick, label: "AC", className: "bg-red-200 hover:bg-red-300" })}
                    {CalculatorButton({ onClick: handleToggleSign, label: "+/-" })}
                    {CalculatorButton({ onClick: handlePercent, label: "%" })}
                    {CalculatorButton({ onClick: () => handleOperatorClick('/'), label: "÷", className: "bg-blue-200 hover:bg-blue-300" })}

                    {CalculatorButton({ onClick: () => handleDigitClick('7'), label: "7" })}
                    {CalculatorButton({ onClick: () => handleDigitClick('8'), label: "8" })}
                    {CalculatorButton({ onClick: () => handleDigitClick('9'), label: "9" })}
                    {CalculatorButton({ onClick: () => handleOperatorClick('*'), label: "×", className: "bg-blue-200 hover:bg-blue-300" })}

                    {CalculatorButton({ onClick: () => handleDigitClick('4'), label: "4" })}
                    {CalculatorButton({ onClick: () => handleDigitClick('5'), label: "5" })}
                    {CalculatorButton({ onClick: () => handleDigitClick('6'), label: "6" })}
                    {CalculatorButton({ onClick: () => handleOperatorClick('-'), label: "−", className: "bg-blue-200 hover:bg-blue-300" })}

                    {CalculatorButton({ onClick: () => handleDigitClick('1'), label: "1" })}
                    {CalculatorButton({ onClick: () => handleDigitClick('2'), label: "2" })}
                    {CalculatorButton({ onClick: () => handleDigitClick('3'), label: "3" })}
                    {CalculatorButton({ onClick: () => handleOperatorClick('+'), label: "+", className: "bg-blue-200 hover:bg-blue-300" })}

                    {CalculatorButton({ onClick: () => handleDigitClick('0'), label: "0", className: "col-span-2" })}
                    {CalculatorButton({ onClick: handleDecimalClick, label: "." })}
                    {CalculatorButton({ onClick: () => handleOperatorClick('='), label: "=", className: "bg-blue-500 hover:bg-blue-600 text-white" })}
                </div>
                <button onClick={() => setShowLogForm(true)} className="mt-4 w-full py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-600">
                    Log this amount
                </button>
            </div>
            <aside className="w-1/3 flex flex-col bg-white border-l p-4">
                <div className="flex-shrink-0 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-500">Current Balance</h3>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 my-3">Recent Transactions</h3>
                <div className="flex-grow overflow-y-auto">
                    {transactions.length > 0 ? (
                        <ul className="space-y-3 pr-2">
                           {transactions.map(t => (
                               <li key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                   <div>
                                       <p className="font-semibold text-gray-700">{t.description}</p>
                                        {t.studentName && <p className="text-xs text-blue-600">For: {t.studentName}</p>}
                                       <p className="text-xs text-gray-500">{new Date(t.date).toLocaleString('es-MX')}</p>

                                   </div>
                                   <p className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                       {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                   </p>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No transactions yet.</p>
                    )}
                </div>
            </aside>
        </div>
    );
};

export const ClipCalculatorApp: React.FC<Partial<AppProps>> = () => {
    const [amount, setAmount] = useState('');
    const [paymentType, setPaymentType] = useState<'contado' | 'msi'>('contado');
    const [cardType, setCardType] = useState<'visa_mc' | 'amex'>('visa_mc');
    const [msiMonths, setMsiMonths] = useState<3 | 6 | 9 | 12>(3);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    };

    const IVA_RATE = 0.16;
    const CONTADO_RATE = 0.036;

    const MSI_RATES = {
        visa_mc: { 3: 0.045, 6: 0.075, 9: 0.115, 12: 0.125 },
        amex:    { 3: 0.075, 6: 0.099, 9: 0.139, 12: 0.159 }
    };

    const parsedAmount = parseFloat(amount) || 0;
    let commissionRate = 0;

    if (paymentType === 'contado') {
        commissionRate = CONTADO_RATE;
    } else {
        commissionRate = MSI_RATES[cardType][msiMonths];
    }

    const totalCommissionFactor = commissionRate * (1 + IVA_RATE);

    // --- Scenario 1: Business absorbs the fee (charge amount is sale price) ---
    const salePrice = parsedAmount;
    const commissionOnSalePrice = salePrice * totalCommissionFactor;
    const amountReceivedIfAbsorbed = salePrice - commissionOnSalePrice;

    // --- Scenario 2: Client pays the fee (charge amount is calculated to receive sale price) ---
    const targetAmountToReceive = parsedAmount;
    let amountToChargeClient = 0;
    if (totalCommissionFactor < 1) { // Avoid division by zero or negative
        amountToChargeClient = targetAmountToReceive / (1 - totalCommissionFactor);
    }
    const commissionForClientPays = amountToChargeClient - targetAmountToReceive;
    const msiMonthlyPayment = amountToChargeClient / msiMonths;


    return (
        <div className="w-full h-full bg-gray-50 text-black flex flex-col items-center p-6 overflow-y-auto">
            <header className="w-full max-w-md text-center">
                {ClipIcon("w-20 h-20 mx-auto mb-4")}
                <h1 className="text-2xl font-bold text-gray-800">Calculadora de Comisiones</h1>
                <p className="text-sm text-gray-600 mt-1">Ingresa el precio de tu producto o servicio.</p>
            </header>

            <main className="w-full max-w-md mt-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-2xl text-gray-500">$</span>
                    <input type="text" value={amount} onChange={handleAmountChange} placeholder="0.00" className="w-full text-5xl font-light text-center p-4 pl-10 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 transition bg-transparent" autoFocus/>
                </div>

                <div className="mt-6">
                    <div className="flex bg-gray-200 rounded-lg p-1">
                        <button onClick={() => setPaymentType('contado')} className={`w-1/2 p-2 rounded-md font-semibold text-center transition ${paymentType === 'contado' ? 'bg-white shadow' : 'text-gray-600'}`}>De contado</button>
                        <button onClick={() => setPaymentType('msi')} className={`w-1/2 p-2 rounded-md font-semibold text-center transition ${paymentType === 'msi' ? 'bg-white shadow' : 'text-gray-600'}`}>Meses sin Intereses</button>
                    </div>
                </div>

                {paymentType === 'msi' && (
                    <div className="mt-4 animate-fade-in">
                         <div className="flex border border-gray-300 rounded-lg p-1">
                             <button onClick={() => setCardType('visa_mc')} className={`w-1/2 p-2 rounded-md text-center transition flex items-center justify-center gap-2 ${cardType === 'visa_mc' ? 'bg-gray-200' : ''}`}>
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-5"/>
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4"/>
                             </button>
                             <button onClick={() => setCardType('amex')} className={`w-1/2 p-2 rounded-md text-center transition flex items-center justify-center ${cardType === 'amex' ? 'bg-gray-200' : ''}`}>
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-5"/>
                             </button>
                         </div>
                         <div className="grid grid-cols-4 gap-2 mt-4">
                            {[3, 6, 9, 12].map(months => (
                                <button key={months} onClick={() => setMsiMonths(months as 3|6|9|12)} className={`p-3 rounded-lg font-semibold text-center transition ${msiMonths === months ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    {months} <span className="text-xs">meses</span>
                                </button>
                            ))}
                         </div>
                    </div>
                )}

                {parsedAmount > 0 && (
                     <div className="mt-8 bg-blue-600 text-white rounded-lg p-4 shadow-lg animate-fade-in space-y-4">
                        <div className="bg-blue-700/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-center text-blue-200 mb-2">Opción 1: Tú absorbes la comisión</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>Cobras al cliente:</span> <span>{formatCurrency(salePrice)}</span></div>
                                <div className="flex justify-between"><span>Comisión Clip + IVA:</span> <span className="text-red-300">- {formatCurrency(commissionOnSalePrice)}</span></div>
                            </div>
                            <hr className="my-2 border-blue-500" />
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold">Tú recibes en tu cuenta:</span>
                                <span className="font-bold">{formatCurrency(amountReceivedIfAbsorbed)}</span>
                            </div>
                        </div>

                        <div className="bg-blue-700/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-center text-blue-200 mb-2">Opción 2: El cliente paga la comisión</h3>
                             <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>Tú quieres recibir:</span> <span>{formatCurrency(targetAmountToReceive)}</span></div>
                                <div className="flex justify-between"><span>Añadir comisión + IVA:</span> <span className="text-green-300">+ {formatCurrency(commissionForClientPays)}</span></div>
                            </div>
                            <hr className="my-2 border-blue-500" />
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold">Total a cobrar en terminal:</span>
                                <span className="font-bold">{formatCurrency(amountToChargeClient)}</span>
                            </div>
                            {paymentType === 'msi' && (
                                <div className="text-right text-xs mt-1 text-blue-200">
                                    ({msiMonths} pagos de {formatCurrency(msiMonthlyPayment)})
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Placeholder Apps ---
export const MaxfraOfficeSuiteApp: React.FC<Partial<AppProps>> = ({ file }) => {
    const renderContent = () => {
        if (file?.subApp === 'word') {
            return <div className="p-4"><h2 className="font-bold text-lg flex items-center gap-2">{MaxfraWordIcon()}Maxfra Word</h2><p className="mt-2">Editing: {file.name}</p></div>;
        }
        if (file?.subApp === 'excel') {
            return <div className="p-4"><h2 className="font-bold text-lg flex items-center gap-2">{MaxfraExcelIcon()}Maxfra Excel</h2><p className="mt-2">Editing: {file.name}</p></div>;
        }
        return <div className="p-4"><h2 className="font-bold text-lg flex items-center gap-2">{MaxfraOutlookIcon()}Maxfra Outlook</h2><p className="mt-2">Welcome to your inbox.</p></div>;
    };
    return <div className="w-full h-full bg-gray-100 text-black">{renderContent()}</div>;
};

export const MaxfraLibraryApp: React.FC<Partial<AppProps>> = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="w-full h-full bg-gray-200 text-black p-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Maxfra Library</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {LIBRARY_IMAGES.map((image, index) => (
                    <div key={index} className="cursor-pointer group" onClick={() => setSelectedImage(image.src)}>
                        <img src={image.src} alt={image.title} className="w-full h-40 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow" />
                        <p className="text-center font-semibold mt-2">{image.title}</p>
                    </div>
                ))}
            </div>
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Full view" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
                </div>
            )}
        </div>
    );
};

export const ImageViewerApp: React.FC<Partial<AppProps>> = ({ file }) => {
    return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4">
            {file?.content ? (
                <img src={file.content} alt={file.name} className="max-w-full max-h-full object-contain" />
            ) : (
                <p className="text-white">No image to display.</p>
            )}
        </div>
    );
};


// --- Student Database App ---
const emptyStudent: Omit<Student, 'id'> = { 
    firstName: '', 
    paternalLastName: '', 
    maternalLastName: '', 
    mobilePhone: '', 
    paymentStatus: 'Pending', 
    diplomaStatus: 'Not Available',
    attendance: [],
    documents: [],
    libraryResources: [],
    diplomaFile: undefined,
};

const FormSection: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({ title, children, className }) => (
    <fieldset className={`border border-slate-200 p-4 rounded-md ${className}`}>
        <legend className="px-2 font-semibold text-base text-slate-600">{title}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">{children}</div>
    </fieldset>
);

const FormInput: React.FC<{
    label: string, 
    name: keyof Student, 
    value: any, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    type?: string
}> = ({label, name, value, onChange, required=false, type="text"}) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <input type={type} name={name} value={value || ''} onChange={onChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
    </div>
);

const FormSelect: React.FC<{
    label: string, 
    name: keyof Student, 
    value: any, 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    options: readonly string[] | string[]
}> = ({label, name, value, onChange, options}) => (
     <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <select name={name} value={value || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

// --- Student Database Tab Components ---
const ProfileTabContent = React.memo(({ formData, onChange }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Personal Information">
            <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={onChange} required/>
            <FormInput label="Paternal Last Name" name="paternalLastName" value={formData.paternalLastName} onChange={onChange} required/>
            <FormInput label="Maternal Last Name" name="maternalLastName" value={formData.maternalLastName} onChange={onChange}/>
            <FormInput label="Date of Birth" name="dob" value={formData.dob} onChange={onChange} type="date"/>
            <FormInput label="Nationality" name="nationality" value={formData.nationality} onChange={onChange}/>
            <FormSelect label="Sex" name="sex" value={formData.sex} onChange={onChange} options={['Male', 'Female', 'Other']}/>
            <FormSelect label="COVID Vaccine" name="covidVaccine" value={formData.covidVaccine} onChange={onChange} options={['Yes', 'No', 'Unknown']}/>
            <FormInput label="CURP" name="curp" value={formData.curp} onChange={onChange}/>
        </FormSection>
        <FormSection title="Contact & Professional">
            <FormInput label="Mobile Phone" name="mobilePhone" value={formData.mobilePhone} onChange={onChange} required/>
            <FormInput label="Home Phone" name="homePhone" value={formData.homePhone} onChange={onChange}/>
            <FormInput label="Profession" name="profession" value={formData.profession} onChange={onChange}/>
            <FormInput label="Education Level" name="educationLevel" value={formData.educationLevel} onChange={onChange}/>
            <FormInput label="Allergies" name="allergies" value={formData.allergies} onChange={onChange}/>
        </FormSection>
        <FormSection title="Address">
            <FormInput label="Street" name="addressStreet" value={formData.addressStreet} onChange={onChange}/>
            <FormInput label="Colonia" name="addressColonia" value={formData.addressColonia} onChange={onChange}/>
            <FormInput label="Delegacion" name="addressDelegacion" value={formData.addressDelegacion} onChange={onChange}/>
            <FormInput label="Postal Code" name="addressCp" value={formData.addressCp} onChange={onChange}/>
        </FormSection>
    </div>
));

const CourseFinanceTabContent = React.memo(({ formData, onChange, transactions, studentId }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, transactions: Transaction[], studentId: string | null }) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Course Information">
            <FormInput label="Course Name" name="course" value={formData.course} onChange={onChange}/>
            <FormInput label="Course Duration" name="courseDuration" value={formData.courseDuration} onChange={onChange}/>
            <FormInput label="Total Classes" name="totalClasses" value={formData.totalClasses} onChange={onChange}/>
            <FormInput label="Start Date" name="startDate" value={formData.startDate} onChange={onChange} type="date"/>
            <FormInput label="End Date" name="endDate" value={formData.endDate} onChange={onChange} type="date"/>
            <FormInput label="Registration Date" name="registrationDate" value={formData.registrationDate} onChange={onChange} type="date"/>
        </FormSection>
        <FormSection title="Financial & Payment Information">
            <FormInput label="Registration Cost" name="registrationCost" value={formData.registrationCost} onChange={onChange}/>
            <FormInput label="Total Cost" name="totalCost" value={formData.totalCost} onChange={onChange}/>
            <FormInput label="Monthly Payment" name="monthlyPayment" value={formData.monthlyPayment} onChange={onChange}/>
            <FormInput label="Cash Payment" name="cashPayment" value={formData.cashPayment} onChange={onChange}/>
            <FormInput label="Down Payment" name="downPayment" value={formData.downPayment} onChange={onChange}/>
            <FormInput label="Payment Date" name="paymentDate" value={formData.paymentDate} onChange={onChange} type="date"/>
            <FormSelect label="Payment Status" name="paymentStatus" value={formData.paymentStatus} onChange={onChange} options={['Paid', 'Pending', 'Partial']}/>
            <FormSelect label="Diploma Status" name="diplomaStatus" value={formData.diplomaStatus} onChange={onChange} options={['Available', 'Issued', 'Not Available']}/>
        </FormSection>
        <FormSection title="Financial History">
            <div className="col-span-full max-h-60 overflow-y-auto pr-2">
                {(() => {
                    const studentTransactions = transactions.filter(t => t.studentId === studentId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    if (studentTransactions.length === 0) {
                        return <p className="text-sm text-slate-500">No transactions on file for this student.</p>;
                    }
                    return (
                        <ul className="space-y-2">
                            {studentTransactions.map(t => (
                                <li key={t.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-md">
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">{t.description}</p>
                                        <p className="text-xs text-slate-500">{new Date(t.date).toLocaleString('es-MX')}</p>
                                    </div>
                                    <p className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(t.amount)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    );
                })()}
            </div>
        </FormSection>
    </div>
));

const EmergencyGuardianTabContent = React.memo(({ formData, onChange }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Emergency Contact">
            <FormInput label="Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={onChange}/>
            <FormInput label="Paternal Last Name" name="emergencyContactPaternalLastName" value={formData.emergencyContactPaternalLastName} onChange={onChange}/>
            <FormInput label="Maternal Last Name" name="emergencyContactMaternalLastName" value={formData.emergencyContactMaternalLastName} onChange={onChange}/>
            <FormInput label="Date of Birth" name="emergencyContactDob" value={formData.emergencyContactDob} onChange={onChange} type="date"/>
            <FormInput label="Nationality" name="emergencyContactNationality" value={formData.emergencyContactNationality} onChange={onChange}/>
            <FormSelect label="Sex" name="emergencyContactSex" value={formData.emergencyContactSex} onChange={onChange} options={['Male', 'Female', 'Other']}/>
            <FormInput label="Relationship" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={onChange}/>
            <FormInput label="Mobile Phone" name="emergencyContactMobilePhone" value={formData.emergencyContactMobilePhone} onChange={onChange}/>
            <FormInput label="Home Phone" name="emergencyContactHomePhone" value={formData.emergencyContactHomePhone} onChange={onChange}/>
            <FormInput label="Street" name="emergencyContactAddressStreet" value={formData.emergencyContactAddressStreet} onChange={onChange}/>
            <FormInput label="Colonia" name="emergencyContactAddressColonia" value={formData.emergencyContactAddressColonia} onChange={onChange}/>
            <FormInput label="Delegacion" name="emergencyContactAddressDelegacion" value={formData.emergencyContactAddressDelegacion} onChange={onChange}/>
            <FormInput label="Postal Code" name="emergencyContactAddressCp" value={formData.emergencyContactAddressCp} onChange={onChange}/>
        </FormSection>
        <FormSection title="Guardian Information (if minor)">
            <FormInput label="Name" name="guardianName" value={formData.guardianName} onChange={onChange}/>
            <FormInput label="Paternal Last Name" name="guardianPaternalLastName" value={formData.guardianPaternalLastName} onChange={onChange}/>
            <FormInput label="Maternal Last Name" name="guardianMaternalLastName" value={formData.guardianMaternalLastName} onChange={onChange}/>
            <FormInput label="Date of Birth" name="guardianDob" value={formData.guardianDob} onChange={onChange} type="date"/>
            <FormInput label="Nationality" name="guardianNationality" value={formData.guardianNationality} onChange={onChange}/>
            <FormSelect label="Sex" name="guardianSex" value={formData.guardianSex} onChange={onChange} options={['Male', 'Female', 'Other']}/>
            <FormInput label="Mobile Phone" name="guardianMobilePhone" value={formData.guardianMobilePhone} onChange={onChange}/>
            <FormInput label="Home Phone" name="guardianHomePhone" value={formData.guardianHomePhone} onChange={onChange}/>
            <FormInput label="Street" name="guardianAddressStreet" value={formData.guardianAddressStreet} onChange={onChange}/>
            <FormInput label="Colonia" name="guardianAddressColonia" value={formData.guardianAddressColonia} onChange={onChange}/>
            <FormInput label="Delegacion" name="guardianAddressDelegacion" value={formData.guardianAddressDelegacion} onChange={onChange}/>
        </FormSection>
    </div>
));

const AttendanceTabContent = React.memo(({ attendance, newRecord, onNewRecordChange, onAdd, onDelete }: {
    attendance: AttendanceRecord[] | undefined,
    newRecord: Omit<AttendanceRecord, 'id'>,
    onNewRecordChange: React.Dispatch<React.SetStateAction<Omit<AttendanceRecord, 'id'>>>,
    onAdd: (e: React.FormEvent) => void,
    onDelete: (id: string) => void,
}) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Log New Attendance">
            <form onSubmit={onAdd} className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Date</label>
                    <input type="date" value={newRecord.date} onChange={e => onNewRecordChange({...newRecord, date: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" required/>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Topic Covered</label>
                    <input type="text" placeholder="e.g., Basic strokes on latex" value={newRecord.topic} onChange={e => onNewRecordChange({...newRecord, topic: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select value={newRecord.status} onChange={e => onNewRecordChange({...newRecord, status: e.target.value as any})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                        <option>Present</option><option>Absent</option><option>Excused</option>
                    </select>
                </div>
                 <button type="submit" className="md:col-start-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700">Add Log</button>
            </form>
        </FormSection>
        <FormSection title="Attendance History">
            <div className="col-span-full max-h-80 overflow-y-auto pr-2">
                {(attendance || []).length === 0 ? <p className="text-sm text-slate-500">No attendance records found.</p> :
                    <ul className="space-y-3">
                        {(attendance || []).map(log => (
                            <li key={log.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-slate-800">{new Date(log.date + 'T12:00:00').toLocaleDateString('en-CA')} - <span className={`font-bold ${log.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</span></p>
                                    <p className="text-sm text-slate-600 mt-1">{log.topic}</p>
                                </div>
                                <button onClick={() => onDelete(log.id)} className="p-1 rounded-full hover:bg-red-100">{TrashIcon("w-4 h-4 text-red-500")}</button>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </FormSection>
    </div>
));

const DocumentsTabContent = React.memo(({ documents, onUpload, onDelete }: { documents: StudentDocument[] | undefined, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, onDelete: (id: string) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Upload Document">
            <div className="col-span-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select a file (PDF, JPG, PNG)</label>
                <input type="file" onChange={onUpload} accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>
        </FormSection>
        <FormSection title="Uploaded Documents">
            <div className="col-span-full max-h-80 overflow-y-auto pr-2">
                {(documents || []).length === 0 ? <p className="text-sm text-slate-500">No documents uploaded.</p> :
                    <ul className="space-y-3">
                        {(documents || []).map(doc => (
                            <li key={doc.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    {FileIcon("w-6 h-6 text-slate-500")}
                                    <div>
                                        <a href={doc.dataUrl} download={doc.name} className="font-medium text-indigo-600 hover:underline">{doc.name}</a>
                                        <p className="text-xs text-slate-500">{doc.type}</p>
                                    </div>
                                </div>
                                <button onClick={() => onDelete(doc.id)} className="p-1 rounded-full hover:bg-red-100">{TrashIcon("w-4 h-4 text-red-500")}</button>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </FormSection>
    </div>
));

const SignatureDiplomaTabContent = React.memo(({ signature, onSignatureEnd, onDiplomaUpload, diplomaFile, onDiplomaDelete }: { signature: string | undefined, onSignatureEnd: (dataUrl: string) => void, onDiplomaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, diplomaFile: {name: string, dataUrl: string} | undefined, onDiplomaDelete: () => void }) => {
    const sigPadRef = useRef<HTMLCanvasElement>(null);
    return (
        <div className="space-y-6 animate-fade-in">
            <FormSection title="Official Signature on File">
                <div className="col-span-full flex flex-col items-center">
                    <SignaturePad ref={sigPadRef} width={400} height={200} onEnd={onSignatureEnd} initialData={signature}/>
                    <button onClick={() => { const canvas = sigPadRef.current; if (canvas) { const ctx = canvas.getContext('2d'); ctx?.clearRect(0,0,canvas.width,canvas.height); onSignatureEnd(''); } }} className="mt-2 text-sm text-indigo-600 hover:underline">Clear</button>
                </div>
            </FormSection>
            <FormSection title="Diploma">
                <div className="col-span-full">
                    {diplomaFile ? (
                        <div className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                             <a href={diplomaFile.dataUrl} download={diplomaFile.name} className="font-medium text-indigo-600 hover:underline">{diplomaFile.name}</a>
                             <button onClick={onDiplomaDelete} className="p-1 rounded-full hover:bg-red-100">{TrashIcon("w-4 h-4 text-red-500")}</button>
                        </div>
                    ) : (
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Upload Final Diploma</label>
                             <input type="file" onChange={onDiplomaUpload} accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                    )}
                </div>
            </FormSection>
        </div>
    );
});

const TabButton = React.memo(({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
        {label}
    </button>
));


export const StudentDatabaseApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Student, 'id'>>(emptyStudent);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [activeTab, setActiveTab] = useState('Profile');
    const [newAttendanceRecord, setNewAttendanceRecord] = useState<Omit<AttendanceRecord, 'id'>>({ date: new Date().toISOString().slice(0,10), course: '', topic: '', status: 'Present' });

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (studentsFile) {
            try { 
                const loadedStudents = JSON.parse(studentsFile.content);
                if (Array.isArray(loadedStudents)) {
                    setStudents(loadedStudents);
                    if (loadedStudents.length > 0 && !selectedStudentId) {
                        setSelectedStudentId(loadedStudents[0].id);
                    }
                }
            } 
            catch { console.error("Failed to parse students file"); }
        }
        
        const transactionsFile = dir?.children.find(f => f.name === TRANSACTIONS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (transactionsFile) {
            try { setTransactions(JSON.parse(transactionsFile.content)); }
            catch { console.error("Failed to parse transactions file"); }
        }

    }, [fs, selectedStudentId]);

    useEffect(() => {
        const selectedStudent = students.find(s => s.id === selectedStudentId);
        if (selectedStudent) {
            setFormData(selectedStudent);
        } else {
            setFormData(emptyStudent);
        }
    }, [selectedStudentId, students]);

    const saveStudents = useCallback((updatedStudents: Student[]) => {
        if (!setFs) return;
        setStudents(updatedStudents);
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, STUDENTS_FILE_NAME, JSON.stringify(updatedStudents, null, 2)));
    }, [setFs]);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }, []);
    
    const handleAddStudent = () => {
        const newId = `student-${Date.now()}`;
        const newStudent = { id: newId, ...emptyStudent, firstName: 'New', paternalLastName: 'Student' };
        saveStudents([...students, newStudent]);
        setSelectedStudentId(newId);
    };

    const handleSave = () => {
        if (!selectedStudentId) return;
        const updatedStudents = students.map(s => s.id === selectedStudentId ? { ...formData, id: selectedStudentId } : s);
        saveStudents(updatedStudents);
        alert('Student saved!');
    };

    const handleDelete = () => {
        if (!selectedStudentId || !window.confirm("Are you sure you want to delete this student? This cannot be undone.")) return;
        const updatedStudents = students.filter(s => s.id !== selectedStudentId);
        saveStudents(updatedStudents);
        setSelectedStudentId(updatedStudents[0]?.id || null);
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => 
            `${student.firstName} ${student.paternalLastName}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ).sort((a,b) => a.firstName.localeCompare(b.firstName));
    }, [debouncedSearchQuery, students]);
    
    // --- Handlers for new features ---

    const handleAddAttendance = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedStudent = { ...formData, attendance: [...(formData.attendance || []), { id: `att-${Date.now()}`, ...newAttendanceRecord }] };
        setFormData(updatedStudent);
        setNewAttendanceRecord({ date: new Date().toISOString().slice(0,10), course: '', topic: '', status: 'Present' });
    };
    
    const handleDeleteAttendance = (id: string) => {
        const updatedStudent = { ...formData, attendance: (formData.attendance || []).filter(att => att.id !== id) };
        setFormData(updatedStudent);
    };
    
    const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const newDoc: StudentDocument = { id: `doc-${Date.now()}`, name: file.name, type: file.type, dataUrl: event.target?.result as string };
            setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), newDoc]}));
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteDocument = (id: string) => {
        setFormData(prev => ({ ...prev, documents: (prev.documents || []).filter(doc => doc.id !== id) }));
    };
    
    const handleSignatureEnd = (dataUrl: string) => {
        setFormData(prev => ({...prev, signature: dataUrl }));
    };

    const handleDiplomaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, diplomaFile: { name: file.name, dataUrl: event.target?.result as string }}));
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteDiploma = () => {
        setFormData(prev => ({...prev, diplomaFile: undefined }));
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'Profile': return <ProfileTabContent formData={formData} onChange={handleFormChange} />;
            case 'Course & Finance': return <CourseFinanceTabContent formData={formData} onChange={handleFormChange} transactions={transactions} studentId={selectedStudentId}/>;
            case 'Guardian & Emergency': return <EmergencyGuardianTabContent formData={formData} onChange={handleFormChange} />;
            case 'Attendance': return <AttendanceTabContent attendance={formData.attendance} newRecord={newAttendanceRecord} onNewRecordChange={setNewAttendanceRecord} onAdd={handleAddAttendance} onDelete={handleDeleteAttendance}/>;
            case 'Documents': return <DocumentsTabContent documents={formData.documents} onUpload={handleUploadDocument} onDelete={handleDeleteDocument} />;
            case 'Signature & Diploma': return <SignatureDiplomaTabContent signature={formData.signature} onSignatureEnd={handleSignatureEnd} onDiplomaUpload={handleDiplomaUpload} diplomaFile={formData.diplomaFile} onDiplomaDelete={handleDeleteDiploma}/>;
            default: return null;
        }
    };
    
    const tabs = ['Profile', 'Course & Finance', 'Guardian & Emergency', 'Attendance', 'Documents', 'Signature & Diploma'];
    
    return (
        <div className="w-full h-full flex bg-slate-100 text-slate-800 font-sans text-sm">
            <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b">
                    <input type="search" placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm"/>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {filteredStudents.map(student => (
                        <button key={student.id} onClick={() => setSelectedStudentId(student.id)} className={`w-full text-left p-3 flex items-center gap-3 ${selectedStudentId === student.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}>
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">{student.firstName[0]}{student.paternalLastName[0]}</div>
                           <span className="font-semibold">{student.firstName} {student.paternalLastName}</span>
                        </button>
                    ))}
                </div>
                <div className="p-2 border-t">
                    <button onClick={handleAddStudent} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700">Add New Student</button>
                </div>
            </aside>
            <main className="flex-grow flex flex-col">
                <header className="flex justify-between items-center p-4 bg-white border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">{formData.firstName} {formData.paternalLastName} {formData.maternalLastName}</h2>
                    <div className="flex gap-2">
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600">Delete</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">Save Changes</button>
                    </div>
                </header>
                <div className="border-b border-slate-200 bg-white">
                    <nav className="flex px-4">
                        {tabs.map(tab => <TabButton key={tab} label={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />)}
                    </nav>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    {selectedStudentId ? renderTabContent() : <div className="text-center text-slate-500">Select or create a student to get started.</div>}
                </div>
            </main>
        </div>
    );
};