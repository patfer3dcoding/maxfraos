import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { FolderIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, ReloadIcon, HomeIcon, PlusIcon, CloseIcon, MaxfraWordIcon, MaxfraExcelIcon, MaxfraOutlookIcon, TrashIcon, WhatsAppIcon, SearchIcon, CheckInIcon, ShareIcon } from '../components/icons';
import type { AppProps, FSNode, FileNode, DirectoryNode, FileData, Student, CheckInLog } from '../types';
import { MAXFRA_LOGO_B64 } from '../constants';

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
                        <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            <button onClick={handleAddTab} className="p-1 ml-1 mb-1 rounded-md hover:bg-gray-400/50">
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="flex-shrink-0 p-1.5 bg-gray-200 flex items-center gap-1 border-b border-gray-300">
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-300 text-gray-700"><ChevronLeftIcon /></button>
            <button onClick={handleForward} className="p-2 rounded-full hover:bg-gray-300 text-gray-700"><ChevronRightIcon /></button>
            <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-gray-300 text-gray-700"><ReloadIcon /></button>
            <button onClick={handleHome} className="p-2 rounded-full hover:bg-gray-300 text-gray-700"><HomeIcon /></button>
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
                    ref={el => (iframeRefs.current[tab.id] = el)}
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

export const FileExplorerApp: React.FC<Partial<AppProps>> = ({ fs, setFs, openApp }) => {
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    
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
        const extension = file.name.split('.').pop();
        let fileData: FileData = file;
        let appId = 'notepad';

        if (extension === 'doc' || extension === 'docx') {
            appId = 'maxfraOfficeSuite';
            fileData = { ...file, subApp: 'word' };
        }
        if (extension === 'xls' || extension === 'xlsx') {
            appId = 'maxfraOfficeSuite';
            fileData = { ...file, subApp: 'excel' };
        }
        openApp(appId, fileData);
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
                <button onClick={handleBack} disabled={currentPath.length === 0} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
                <div className="flex-grow p-2 bg-white border rounded-sm min-w-[200px]">C:\{currentPath.join('\\')}</div>
                <input 
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="p-2 border rounded-sm w-full sm:w-auto"
                />
            </div>
            <div className="flex-grow p-2 overflow-y-auto">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {itemsToDisplay.map(node => (
                        <div key={node.name} className="flex flex-col items-center p-2 rounded hover:bg-blue-100 cursor-pointer"
                            onDoubleClick={() => node.type === 'directory' ? handleNavigate(node.name) : handleOpenFile(node as FileNode)}>
                            {node.type === 'directory' ? <FolderIcon /> : <FileIcon />}
                            <span className="text-xs mt-1 text-center break-all">{node.name}</span>
                        </div>
                    ))}
                     {searchResults.map((result, index) => (
                        <div key={`${result.node.name}-${index}`} className="flex flex-col items-center p-2 rounded hover:bg-green-100 cursor-pointer"
                            onDoubleClick={() => handleSearchResultClick(result)}>
                            {result.node.type === 'directory' ? <FolderIcon /> : <FileIcon />}
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
export const CalculatorApp: React.FC<Partial<AppProps>> = () => { /* Unchanged */ return <div>Calculator</div>; };

// --- Calendar / Appointment Book App ---

const APPOINTMENTS_FILE_PATH = ['system'];
const APPOINTMENTS_FILE_NAME = 'maxfra-appointments.json';
const STUDENTS_FILE_NAME = 'maxfra-students.json';
const CHECK_IN_LOG_FILE_NAME = 'maxfra-check-in-log.json';

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

interface Appointment {
  id: string;
  location: Location;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  studentId: string;
  teacher: Teacher;
  type: 'Course' | 'Special';
  details: Course | Special;
  attendance?: 'Pending' | 'Present' | 'Absent';
  notes?: string;
}

interface GroupedAppointment {
    id: string;
    location: Location;
    date: string;
    time: string;
    details: Course | Special;
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

const AppointmentDetailModal = ({ appointmentGroup, studentsById, onClose, onUpdateAppointment }: { appointmentGroup: GroupedAppointment, studentsById: Record<string, Student>, onClose: () => void, onUpdateAppointment: (app: Appointment) => void }) => {

    const StudentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
        const student = studentsById[appointment.studentId];
        const [notes, setNotes] = useState(appointment.notes || '');
        if (!student) return null;

        const handleAttendance = (attendance: 'Pending' | 'Present' | 'Absent') => {
            onUpdateAppointment({ ...appointment, attendance });
        };
        const handleSaveNotes = () => {
            onUpdateAppointment({ ...appointment, notes });
        };

        const statusColor = { Paid: 'text-green-600', Pending: 'text-orange-600', Partial: 'text-blue-600' };
        const diplomaColor = { Available: 'text-green-600', Issued: 'text-blue-600', 'Not Available': 'text-gray-500' };

        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg">{student.firstName} {student.paternalLastName}</h4>
                        <p className="text-sm text-gray-600">Tel: {student.mobilePhone}</p>
                        <div className="flex gap-4 text-sm mt-1">
                            <span className={statusColor[student.paymentStatus || 'Pending'] || 'text-gray-500'}>
                                Payment: <b>{student.paymentStatus || 'N/A'}</b>
                            </span>
                            <span className={diplomaColor[student.diplomaStatus || 'Not Available'] || 'text-gray-500'}>
                                Diploma: <b>{student.diplomaStatus || 'N/A'}</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <QRCode data={student.id} size={100} />
                    </div>
                </div>
                <div className="mt-3 border-t pt-3 space-y-2">
                     <div>
                        <label className="text-xs font-semibold text-gray-500">Attendance</label>
                        <div className="flex gap-2 mt-1">
                            {(['Present', 'Absent', 'Pending'] as const).map(status => (
                                <button key={status} onClick={() => handleAttendance(status)} className={`px-3 py-1 text-sm rounded-full ${appointment.attendance === status ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{status}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500">Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded mt-1 text-sm h-20" placeholder="Add notes..."/>
                        <button onClick={handleSaveNotes} className="px-3 py-1 bg-blue-500 text-white rounded text-sm mt-1">Save Notes</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-3xl shadow-2xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{appointmentGroup.details}</h2>
                        <p className="text-gray-500">{appointmentGroup.type} with {appointmentGroup.teacher}</p>
                        <p className="text-gray-500">{appointmentGroup.location} @ {appointmentGroup.time}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-6 border-t pt-4 flex-grow overflow-y-auto pr-2">
                    <h3 className="font-semibold text-lg mb-3">Attendees ({appointmentGroup.students.length}/{appointmentGroup.type === 'Course' ? COURSE_CAPACITY : 1})</h3>
                    <div className="space-y-4 max-h-[60vh]">
                        {appointmentGroup.students.map(app => <StudentCard key={app.id} appointment={app} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Calendar View Components ---

const DailyView = ({ groupedAppointments, studentsById, onAppointmentClick, onExport }: { groupedAppointments: GroupedAppointment[], studentsById: Record<string, Student>, onAppointmentClick: (app: GroupedAppointment) => void, onExport: (location: Location) => void }) => {
    const timeSlots = Array.from({ length: 11 }, (_, i) => `${i + 10}:00`);

    return (
        <div className="bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="w-24 p-3 font-semibold text-left text-gray-600 border-b border-r">Time</th>
                        {LOCATIONS.map(loc => (
                             <th key={loc} className="p-3 font-semibold text-left text-gray-600 border-b relative group">
                                <span>{loc}</span>
                                <button onClick={() => onExport(loc)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 hover:bg-gray-300 transition-opacity" title={`Export ${loc} schedule`}>
                                    <ShareIcon className="w-4 h-4 text-gray-600" />
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
                            {LOCATIONS.map(location => {
                                const apps = groupedAppointments.filter(a => a.location === location && a.time === time);
                                return (
                                    <td key={location} className="p-1.5 align-top border-b relative">
                                        <div className="space-y-1.5">
                                        {apps.map(app => (
                                            <div key={app.id} onClick={() => onAppointmentClick(app)} className={`p-2 rounded-md cursor-pointer hover:shadow-lg transition-shadow ${app.type === 'Course' ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
                                                <p className="font-bold text-gray-800">{app.details}</p>
                                                <p className="text-xs text-gray-600">{app.teacher}</p>
                                                <p className="text-xs text-gray-500 truncate mt-1">{app.students.map(s => studentsById[s.studentId] ? `${studentsById[s.studentId].firstName} ${studentsById[s.studentId].paternalLastName}` : "Unknown").join(', ')}</p>
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
};

const WeeklyView = ({ currentDate, groupedAppointments, studentsById, onAppointmentClick }: { currentDate: Date, groupedAppointments: GroupedAppointment[], studentsById: Record<string, Student>, onAppointmentClick: (app: GroupedAppointment) => void }) => {
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
                    <div key={index} className={`border-r ${index === 6 ? 'border-r-0' : ''}`}>
                        <div className="text-center p-2 border-b bg-gray-50">
                            <p className="text-sm font-semibold text-gray-600">{day.toLocaleDateString('default', { weekday: 'short' })}</p>
                            <p className="text-2xl font-bold text-gray-800">{day.getDate()}</p>
                        </div>
                        <div className="p-2 space-y-2 h-[60vh] overflow-y-auto">
                            {groupedAppointments.filter(a => a.date === formatDateKey(day)).sort((a, b) => a.time.localeCompare(b.time)).map(app => (
                                <div key={app.id} onClick={() => onAppointmentClick(app)} className={`p-2 rounded-md cursor-pointer hover:shadow ${app.type === 'Course' ? 'bg-blue-50 border-blue-400' : 'bg-green-50 border-green-400'} border`}>
                                    <p className="font-semibold text-xs text-gray-800">{app.time} - {app.details}</p>
                                    <p className="text-xs text-gray-500">{app.location}</p>
                                    <p className="text-xs text-gray-500 truncate">{app.students.map(s => studentsById[s.studentId]?.firstName).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MonthlyView = ({ currentDate, appointmentsByDate, onDateClick }: { currentDate: Date, appointmentsByDate: Record<string, Appointment[]>, onDateClick: (date: Date) => void }) => {
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
};


export const CalendarApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('Daily');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingAppointment, setViewingAppointment] = useState<GroupedAppointment | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        const appointmentsFile = dir?.children.find(f => f.name === APPOINTMENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (appointmentsFile) {
            try { setAppointments(JSON.parse(appointmentsFile.content)); } 
            catch (e) { console.error("Failed to parse appointments file", e); }
        }
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (studentsFile) {
            try { setStudents(JSON.parse(studentsFile.content)); } 
            catch (e) { console.error("Failed to parse students file", e); }
        }
    }, [fs]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const studentsById = useMemo(() => {
        return students.reduce((acc, student) => {
            acc[student.id] = student;
            return acc;
        }, {} as Record<string, Student>);
    }, [students]);
    
    const saveAppointments = useCallback((newAppointments: Appointment[]) => {
        if (!setFs) return;
        setAppointments(newAppointments);
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, APPOINTMENTS_FILE_NAME, JSON.stringify(newAppointments, null, 2)));
    }, [setFs]);

    const handleUpdateAppointment = useCallback((updatedApp: Appointment) => {
        const newAppointments = appointments.map(app => app.id === updatedApp.id ? updatedApp : app);
        saveAppointments(newAppointments);
        // Refresh viewing appointment
        if (viewingAppointment) {
            const updatedGroup = { ...viewingAppointment, students: viewingAppointment.students.map(s => s.id === updatedApp.id ? updatedApp : s) };
            setViewingAppointment(updatedGroup);
        }
    }, [appointments, saveAppointments, viewingAppointment]);

    const appointmentsByDate = useMemo(() => {
        return appointments.reduce((acc, curr) => {
            (acc[curr.date] = acc[curr.date] || []).push(curr);
            return acc;
        }, {} as Record<string, Appointment[]>);
    }, [appointments]);

    const groupedAppointments = useMemo(() => {
        const relevantAppointments = view === 'Daily' 
            ? appointmentsByDate[formatDateKey(currentDate)] || []
            : appointments; // For weekly, we filter inside the component. For monthly, we don't need grouped.

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
    }, [currentDate, appointments, appointmentsByDate, view]);

    const handleExportLocationSchedule = useCallback((location: Location) => {
        const appointmentsToExport = groupedAppointments
            .filter(app => app.location === location && app.date === formatDateKey(currentDate))
            .sort((a, b) => a.time.localeCompare(b.time));

        if (appointmentsToExport.length === 0) {
            alert(`No appointments to export for ${location} on this day.`);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Canvas setup ---
        const padding = 40;
        const lineHeight = 22;
        const contentWidth = 600;
        let yPos = padding;

        // Pre-calculate height
        let totalHeight = padding * 2 + 80; // Header and padding
        appointmentsToExport.forEach(appGroup => {
            totalHeight += lineHeight * 2.5; // For appointment line
            const studentNames = appGroup.students.map(s => studentsById[s.studentId]?.firstName || 'Unknown').join(', ');
            ctx.font = '14px sans-serif';
            const studentLines = Math.ceil(ctx.measureText(`Attendees: ${studentNames}`).width / (contentWidth - 20));
            totalHeight += (studentLines * lineHeight * 0.8) + (lineHeight);
        });

        canvas.width = contentWidth + padding * 2;
        canvas.height = totalHeight;

        // --- Drawing ---
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const logoImg = new Image();
        logoImg.onload = () => {
            // Draw Logo & Header
            ctx.drawImage(logoImg, padding, yPos, 60, 60);
            ctx.fillStyle = '#1f2937'; // dark gray
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`Maxfra Schedule - ${location}`, canvas.width - padding, yPos + 38);
            
            ctx.font = '18px sans-serif';
            ctx.fillText(currentDate.toLocaleDateString('en-CA'), canvas.width - padding, yPos + 65);

            yPos += 100;

            // Draw Appointments
            ctx.textAlign = 'left';
            appointmentsToExport.forEach(appGroup => {
                ctx.fillStyle = '#4b5563'; // gray
                ctx.fillRect(padding, yPos - (lineHeight/2) - 3, canvas.width - (padding*2), 1); // separator line

                ctx.font = 'bold 18px sans-serif';
                ctx.fillStyle = '#1f2937';
                ctx.fillText(`${appGroup.time} - ${appGroup.details}`, padding, yPos + lineHeight);
                
                ctx.font = '16px sans-serif';
                ctx.fillStyle = '#6b7280'; // medium gray
                ctx.fillText(`with ${appGroup.teacher}`, padding + 15, yPos + lineHeight * 2);
                
                const studentNames = appGroup.students.map(s => studentsById[s.studentId]?.firstName || 'Unknown').join(', ');
                ctx.fillText(`Attendees: ${studentNames}`, padding + 15, yPos + lineHeight * 3);
                
                yPos += lineHeight * 4.5;
            });
            
            // Trigger download
            const link = document.createElement('a');
            link.download = `maxfra_schedule_${location}_${formatDateKey(currentDate)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        logoImg.onerror = () => alert('Failed to load logo for export.');
        logoImg.src = MAXFRA_LOGO_B64;
    }, [groupedAppointments, studentsById, currentDate]);

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return appointments
            .filter(app => {
                const student = studentsById[app.studentId];
                if (!student) return false;
                const studentName = `${student.firstName} ${student.paternalLastName}`.toLowerCase();
                return studentName.includes(searchQuery.toLowerCase());
            })
            .map(app => ({ app, student: studentsById[app.studentId] }))
            .slice(0, 10);
    }, [searchQuery, appointments, studentsById]);

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
            if (start.getMonth() === end.getMonth()) {
                return `${start.getDate()} - ${end.getDate()}, ${end.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
            } else {
                return `${start.toLocaleDateString('default', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' })}`;
            }
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
                    text += `    - ${appGroup.time}: ${appGroup.details} (${appGroup.students.map(s => studentsById[s.studentId]?.firstName).join(', ')})\n`;
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
                        <WhatsAppIcon className="w-6 h-6 text-green-500"/>
                    </button>
                </div>
                <div className="flex items-center gap-2 justify-center w-1/3">
                     <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeftIcon/></button>
                     <span className="font-bold text-lg w-auto min-w-[280px] text-center text-gray-700">{getHeaderTitle()}</span>
                     <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronRightIcon/></button>
                </div>
                <div className="w-1/3 flex justify-end">
                    <div className="relative w-64" ref={searchRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <SearchIcon className="text-gray-400" /> </div>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setShowSearchResults(true)} placeholder="Search by student name..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:bg-white focus:ring-2"/>
                        {showSearchResults && searchResults.length > 0 && (
                             <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-xl z-10 max-h-80 overflow-y-auto">
                                {searchResults.map(({ app, student }) => (
                                    <div key={app.id} onClick={() => { setCurrentDate(new Date(app.date + 'T12:00:00')); setView('Daily'); setShowSearchResults(false); setSearchQuery(''); }} className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                                        <p className="font-semibold">{student.firstName} {student.paternalLastName}</p>
                                        <p className="text-xs text-gray-500">{app.date} @ {app.time} - {app.details}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
            </header>
            <main className="flex-grow p-4 overflow-auto">
                {view === 'Daily' && <DailyView groupedAppointments={groupedAppointments} studentsById={studentsById} onAppointmentClick={setViewingAppointment} onExport={handleExportLocationSchedule} />}
                {view === 'Weekly' && <WeeklyView currentDate={currentDate} groupedAppointments={groupedAppointments} studentsById={studentsById} onAppointmentClick={setViewingAppointment} />}
                {view === 'Monthly' && <MonthlyView currentDate={currentDate} appointmentsByDate={appointmentsByDate} onDateClick={date => { setCurrentDate(date); setView('Daily'); }} />}
            </main>
            {isModalOpen && <AppointmentModal onClose={() => setIsModalOpen(false)} save={saveAppointments} appointments={appointments} students={students} date={currentDate} />}
            {viewingAppointment && <AppointmentDetailModal appointmentGroup={viewingAppointment} studentsById={studentsById} onClose={() => setViewingAppointment(null)} onUpdateAppointment={handleUpdateAppointment} />}
        </div>
    );
};

const AppointmentModal = ({ onClose, save, appointments, students, date }: { onClose: () => void, save: (apps: Appointment[]) => void, appointments: Appointment[], students: Student[], date: Date }) => {
    const [formData, setFormData] = useState({
        studentId: students[0]?.id || '',
        location: LOCATIONS[0],
        type: 'Course' as 'Course' | 'Special',
        details: COURSES[0] as Course | Special,
        teacher: TEACHERS[0],
        date: formatDateKey(date),
        time: '10:00',
        attendance: 'Pending' as 'Pending' | 'Present' | 'Absent',
        notes: ''
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.studentId) {
            alert("Please select a student.");
            return;
        }

        const appDate = new Date(`${formData.date}T00:00:00`);
        const dayOfWeek = appDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 1) { // Sunday or Monday
            alert("Appointments can only be booked from Tuesday to Saturday.");
            return;
        }

        if (formData.type === 'Course') {
            const existing = appointments.filter(a =>
                a.location === formData.location &&
                a.date === formData.date &&
                a.time === formData.time &&
                a.teacher === formData.teacher &&
                a.details === formData.details
            ).length;
            if (existing >= COURSE_CAPACITY) {
                alert(`This course slot is full (${existing}/${COURSE_CAPACITY}).`);
                return;
            }
        }
        
        const newAppointment: Appointment = { id: Date.now().toString(), ...formData };
        save([...appointments, newAppointment]);
        onClose();
    };

    const detailOptions = formData.type === 'Course' ? COURSES : SPECIALS;
    
    useEffect(() => {
        setFormData(f => ({ ...f, details: detailOptions[0] }));
    }, [formData.type]);

    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-black w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">New Appointment</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                     <select value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required className="w-full p-2 border rounded">
                        <option value="" disabled>Select a student</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.paternalLastName}</option>)}
                    </select>
                    <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value as any})} className="w-full p-2 border rounded">{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2 border rounded"><option value="Course">Course</option><option value="Special">Special</option></select>
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
    
    const commission = parsedAmount * commissionRate;
    const ivaOnCommission = commission * IVA_RATE;
    const totalCommission = commission + ivaOnCommission;
    const amountToReceive = parsedAmount - totalCommission;
    const clientPaysTotal = parsedAmount + (paymentType === 'msi' ? totalCommission : 0);
    const clientPaysMonthly = clientPaysTotal / msiMonths;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    };

    return (
        <div className="w-full h-full bg-gray-50 text-black flex flex-col items-center p-6 overflow-y-auto">
            <header className="w-full max-w-md text-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/Logo_de_Clip.svg" alt="Clip Logo" className="w-20 h-20 mx-auto mb-4"/>
                <h1 className="text-2xl font-bold text-gray-800">Calculadora de Comisiones</h1>
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
                    <div className="mt-8 bg-blue-600 text-white rounded-lg p-6 shadow-lg animate-fade-in">
                        <div className="flex justify-between items-center text-lg">
                            <span>Tu cobro</span>
                            <span className="font-semibold">{formatCurrency(parsedAmount)}</span>
                        </div>
                        {paymentType === 'msi' && (
                            <div className="mt-3 text-blue-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span>El cliente paga</span>
                                    <span className="font-semibold">{formatCurrency(clientPaysTotal)}</span>
                                </div>
                                <div className="text-right text-xs">({msiMonths} pagos de {formatCurrency(clientPaysMonthly)})</div>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm mt-3 text-blue-200">
                            <span>Comisión Clip ({ (commissionRate * 100).toFixed(2) }% + IVA)</span>
                            <span>- {formatCurrency(totalCommission)}</span>
                        </div>
                        <hr className="my-4 border-blue-500" />
                        <div className="flex justify-between items-center text-xl">
                            <span className="font-bold">Recibes en tu cuenta</span>
                            <span className="font-bold">{formatCurrency(amountToReceive)}</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
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


// --- Student Database App ---
const emptyStudent: Omit<Student, 'id'> = { firstName: '', paternalLastName: '', maternalLastName: '', mobilePhone: '', paymentStatus: 'Pending', diplomaStatus: 'Not Available'};

export const StudentDatabaseApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | 'new' | null>(null);
    const [formData, setFormData] = useState<Omit<Student, 'id'>>(emptyStudent);
    const [searchQuery, setSearchQuery] = useState('');
    const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        const file = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (file) {
            try { setStudents(JSON.parse(file.content)); } 
            catch { console.error("Failed to parse students file"); }
        }
    }, [fs]);
    
    useEffect(() => {
        if (selectedStudentId === 'new') {
            setFormData(emptyStudent);
        } else {
            const selected = students.find(s => s.id === selectedStudentId);
            if (selected) {
                 const { id, ...data } = selected;
                 setFormData(data);
            } else {
                setFormData(emptyStudent);
            }
        }
    }, [selectedStudentId, students]);

    const handleSave = useCallback(() => {
        if (!setFs) return;
        if (!formData.firstName || !formData.paternalLastName || !formData.mobilePhone) {
            alert("First Name, Paternal Last Name, and Mobile Phone are required.");
            return;
        }

        const isNew = !selectedStudentId || selectedStudentId === 'new';

        setFs(currentFs => {
            const dir = findNodeByPath(currentFs, APPOINTMENTS_FILE_PATH);
            const file = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
            let currentStudents: Student[] = [];
            if (file) {
                try { currentStudents = JSON.parse(file.content); } catch {}
            }

            let updatedStudents: Student[];
            if (isNew) {
                const newStudent: Student = { ...formData, id: `student-${Date.now()}` };
                updatedStudents = [...currentStudents, newStudent];
            } else {
                updatedStudents = currentStudents.map(s => 
                    s.id === selectedStudentId ? { ...formData, id: selectedStudentId } : s
                );
            }
            return saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, STUDENTS_FILE_NAME, JSON.stringify(updatedStudents, null, 2));
        });

        if (isNew) {
            setSelectedStudentId(null);
        }
        
        alert("Student saved successfully!");
    }, [setFs, formData, selectedStudentId]);
    
    const handleNewStudent = () => {
        setSelectedStudentId('new');
    }
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleClearSignature = () => {
        const canvas = signatureCanvasRef.current;
        if(canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            setFormData(f => ({...f, signature: ''}));
        }
    };

    const filteredStudents = students.filter(s => 
        `${s.firstName} ${s.paternalLastName} ${s.maternalLastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a,b) => a.firstName.localeCompare(b.firstName));

    const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
        <fieldset className="border p-4 rounded-md mt-4">
            <legend className="px-2 font-semibold text-lg">{title}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
        </fieldset>
    );
    const FormInput: React.FC<{label: string, name: keyof Student, value: any, required?: boolean}> = ({label, name, value, required=false}) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input type="text" name={name} value={value || ''} onChange={handleFormChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
    );
    const FormSelect: React.FC<{label: string, name: keyof Student, value: any, options: string[]}> = ({label, name, value, options}) => (
         <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select name={name} value={value || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    return (
        <div className="w-full h-full flex bg-gray-200 text-black">
            <aside className="w-1/3 flex flex-col bg-gray-50 border-r">
                <div className="p-2 border-b space-y-2">
                    <button onClick={handleNewStudent} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                        <PlusIcon className="w-5 h-5"/> New Student
                    </button>
                    <input type="search" placeholder="Search students..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full p-2 border rounded"/>
                </div>
                <nav className="flex-grow overflow-y-auto">
                    {filteredStudents.map(student => (
                        <button key={student.id} onClick={() => setSelectedStudentId(student.id)} className={`w-full text-left px-4 py-3 ${selectedStudentId === student.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                            {student.firstName} {student.paternalLastName}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="w-2/3 p-4 overflow-y-auto">
                {selectedStudentId ? (
                    <div>
                        <FormSection title="Solicitud de Inscripción">
                            <FormInput label="Curso" name="course" value={formData.course} />
                            <FormInput label="Duración del Curso" name="courseDuration" value={formData.courseDuration} />
                            <FormInput label="Total de Clases" name="totalClasses" value={formData.totalClasses} />
                            <FormInput label="Fecha de Inicio" name="startDate" value={formData.startDate} />
                            <FormInput label="Fin de Curso" name="endDate" value={formData.endDate} />
                            <FormInput label="Fecha de Inscripción" name="registrationDate" value={formData.registrationDate} />
                            <FormInput label="Costo de Inscripción" name="registrationCost" value={formData.registrationCost} />
                            <FormInput label="Costo total del curso" name="totalCost" value={formData.totalCost} />
                            <FormInput label="Colegiatura Mensual" name="monthlyPayment" value={formData.monthlyPayment} />
                            <FormInput label="Pago de contado" name="cashPayment" value={formData.cashPayment} />
                            <FormInput label="Anticipo pago de contado" name="downPayment" value={formData.downPayment} />
                            <FormInput label="Fecha pago y restante" name="paymentDate" value={formData.paymentDate} />
                        </FormSection>
                        <FormSection title="Datos Alumna/o">
                             <FormInput label="Nombre(s)" name="firstName" value={formData.firstName} required/>
                             <FormInput label="Apellido Paterno" name="paternalLastName" value={formData.paternalLastName} required/>
                             <FormInput label="Apellido Materno" name="maternalLastName" value={formData.maternalLastName} />
                             <FormInput label="Fecha de Nacimiento" name="dob" value={formData.dob} />
                             <FormInput label="Nacionalidad" name="nationality" value={formData.nationality} />
                             <FormInput label="Sexo" name="sex" value={formData.sex} />
                             <FormInput label="Vacuna COVID-19" name="covidVaccine" value={formData.covidVaccine} />
                             <FormInput label="CURP" name="curp" value={formData.curp} />
                             <FormInput label="Domicilio (Calle y número)" name="addressStreet" value={formData.addressStreet} />
                             <FormInput label="Colonia" name="addressColonia" value={formData.addressColonia} />
                             <FormInput label="Delegación" name="addressDelegacion" value={formData.addressDelegacion} />
                             <FormInput label="C.P." name="addressCp" value={formData.addressCp} />
                             <FormInput label="Profesión" name="profession" value={formData.profession} />
                             <FormInput label="Nivel Máximo de estudios" name="educationLevel" value={formData.educationLevel} />
                             <FormInput label="Teléfono Particular" name="homePhone" value={formData.homePhone} />
                             <FormInput label="Móvil Whatsapp" name="mobilePhone" value={formData.mobilePhone} required/>
                             <FormInput label="Enfermedad o alergias" name="allergies" value={formData.allergies} />
                        </FormSection>
                        <FormSection title="Tracking">
                            <FormSelect label="Payment Status" name="paymentStatus" value={formData.paymentStatus} options={['Pending', 'Partial', 'Paid']} />
                            <FormSelect label="Diploma Status" name="diplomaStatus" value={formData.diplomaStatus} options={['Not Available', 'Available', 'Issued']} />
                        </FormSection>
                        <FormSection title="Datos en Caso de Emergencia">
                            <FormInput label="Nombre Completo" name="emergencyContactName" value={formData.emergencyContactName} />
                            <FormInput label="Parentesco" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} />
                            <FormInput label="Teléfono" name="emergencyContactMobilePhone" value={formData.emergencyContactMobilePhone} />
                        </FormSection>
                         <FormSection title="Firma de Alumna/o">
                             <div className="col-span-full">
                                 <SignaturePad ref={signatureCanvasRef} width={500} height={200} onEnd={(sig) => setFormData(f => ({...f, signature: sig}))} initialData={formData.signature}/>
                                 <button onClick={handleClearSignature} className="mt-2 px-3 py-1 bg-gray-300 rounded text-black">Clear</button>
                             </div>
                        </FormSection>
                        <button onClick={handleSave} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700">Save Student</button>
                    </div>
                ) : <div className="text-center text-gray-500 mt-20">Select a student or create a new one.</div>}
            </main>
        </div>
    )
};

// --- Student Check-in App ---
export const CheckInApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [checkInLog, setCheckInLog] = useState<CheckInLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [foundStudent, setFoundStudent] = useState<Student | null>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (studentsFile) {
            try { setStudents(JSON.parse(studentsFile.content)); } 
            catch { console.error("Failed to parse students file"); }
        }
        const logFile = dir?.children.find(f => f.name === CHECK_IN_LOG_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (logFile) {
            try { setCheckInLog(JSON.parse(logFile.content)); }
            catch { console.error("Failed to parse check-in log file"); }
        }
    }, [fs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.toLowerCase().trim();
        if (!query) return;

        const result = students.find(s => 
            s.id.toLowerCase() === query ||
            s.mobilePhone.replace(/\s+/g, '') === query.replace(/\s+/g, '') ||
            `${s.firstName} ${s.paternalLastName}`.toLowerCase().includes(query) ||
            `${s.firstName} ${s.paternalLastName} ${s.maternalLastName}`.toLowerCase().includes(query)
        );
        
        setFoundStudent(result || null);
        setSignature(null); // Reset signature on new search
    };
    
    const handleConfirmCheckIn = () => {
        if (!foundStudent || !signature || !setFs) return;
        
        setIsLoading(true);
        const newLogEntry: CheckInLog = {
            id: `checkin-${Date.now()}`,
            studentId: foundStudent.id,
            checkInTime: new Date().toISOString(),
            signature: signature,
        };

        const updatedLog = [...checkInLog, newLogEntry];
        setCheckInLog(updatedLog);
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, CHECK_IN_LOG_FILE_NAME, JSON.stringify(updatedLog, null, 2)));

        setTimeout(() => {
            alert(`${foundStudent.firstName} checked in successfully!`);
            handleReset();
            setIsLoading(false);
        }, 500);
    };
    
    const handleReset = () => {
        setSearchQuery('');
        setFoundStudent(null);
        setSignature(null);
    };

    const handleClearSignature = () => {
        const canvas = signatureCanvasRef.current;
        if(canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            setSignature(null);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-black p-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-6">
                    <CheckInIcon className="w-16 h-16 mx-auto text-blue-600"/>
                    <h1 className="text-3xl font-bold mt-2">Student Check-in</h1>
                    <p className="text-gray-500">Find a student to begin the check-in process.</p>
                </div>
                
                {!foundStudent ? (
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Scan QR, or enter Name/Phone..."
                                className="w-full text-lg p-4 pr-12 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-blue-600">
                                <SearchIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="animate-fade-in">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                            <h3 className="font-bold text-xl text-blue-800">{foundStudent.firstName} {foundStudent.paternalLastName}</h3>
                            <p className="text-gray-600">ID: {foundStudent.id}</p>
                            <p className="text-gray-600">Phone: {foundStudent.mobilePhone}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Please Sign Below to Confirm Check-in</label>
                            <SignaturePad ref={signatureCanvasRef} width={380} height={150} onEnd={setSignature} />
                            <button onClick={handleClearSignature} className="mt-2 text-xs text-gray-500 hover:underline">Clear Signature</button>
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                             <button 
                                onClick={handleConfirmCheckIn} 
                                disabled={!signature || isLoading}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                               {isLoading ? 'Saving...' : 'Confirm Check-in'}
                            </button>
                            <button onClick={handleReset} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Maxfra Office Suite ---

const useDocumentExecCommand = (editorRef: React.RefObject<HTMLElement>) => {
    const apply = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    }, [editorRef]);
    return apply;
};

const WordComponent: React.FC<Partial<AppProps>> = ({ file, setFs }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [currentFile, setCurrentFile] = useState(file);
    const applyFormat = useDocumentExecCommand(editorRef);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const handleSave = (asNew = false) => {
        if (!currentFile || asNew) {
            setShowSaveModal(true);
        } else if (setFs && editorRef.current) {
            setFs(fs => saveFileToFS(fs, [], currentFile.name, editorRef.current!.innerHTML));
            alert("File saved!");
        }
    };

    const handleSaveFromModal = (fileName: string) => {
        if (setFs && editorRef.current) {
            const finalName = fileName.endsWith('.doc') ? fileName : `${fileName}.doc`;
            setFs(fs => saveFileToFS(fs, [], finalName, editorRef.current!.innerHTML));
            setCurrentFile({ name: finalName, content: editorRef.current!.innerHTML });
            setShowSaveModal(false);
            alert(`File saved as ${finalName}`);
        }
    };

    const handlePrint = () => {
        if (editorRef.current) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`<html><head><title>${currentFile?.name || 'Document'}</title></head><body>${editorRef.current.innerHTML}</body></html>`);
            printWindow?.document.close();
            printWindow?.print();
            printWindow?.close();
        }
    };

    const SaveModal = () => {
        const [name, setName] = useState(currentFile?.name || 'Untitled.doc');
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded text-black">
                    <h3 className="font-bold mb-2">Save Document</h3>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-1 border border-gray-400 rounded" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setShowSaveModal(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                        <button onClick={() => handleSaveFromModal(name)} className="px-3 py-1 bg-blue-500 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black">
            {showSaveModal && <SaveModal />}
            <div className="flex-shrink-0 p-1 bg-gray-200 flex items-center gap-2 border-b border-gray-300 flex-wrap">
                <div className="flex items-center gap-1">
                    <button onClick={() => handleSave()} className="p-2 rounded hover:bg-gray-300">Save</button>
                    <button onClick={() => handleSave(true)} className="p-2 rounded hover:bg-gray-300">Save As</button>
                    <button onClick={handlePrint} className="p-2 rounded hover:bg-gray-300">Print/PDF</button>
                </div>
                <div className="w-px h-5 bg-gray-400"></div>
                <div className="flex items-center gap-1">
                    <select onChange={e => applyFormat('fontName', e.target.value)} className="p-1 border-gray-300 rounded"><option>Arial</option><option>Verdana</option><option>Times New Roman</option></select>
                    <select onChange={e => applyFormat('fontSize', e.target.value)} className="p-1 border-gray-300 rounded">{[1,2,3,4,5,6,7].map(s => <option key={s} value={s}>{s*2+10}pt</option>)}</select>
                </div>
                <div className="w-px h-5 bg-gray-400"></div>
                 <div className="flex items-center gap-1">
                    <button onClick={() => applyFormat('bold')} className="p-2 rounded hover:bg-gray-300 font-bold">B</button>
                    <button onClick={() => applyFormat('italic')} className="p-2 rounded hover:bg-gray-300 italic">I</button>
                    <button onClick={() => applyFormat('underline')} className="p-2 rounded hover:bg-gray-300 underline">U</button>
                    <input type="color" onChange={e => applyFormat('foreColor', e.target.value)} className="w-6 h-6" title="Text Color"/>
                    <input type="color" onChange={e => applyFormat('hiliteColor', e.target.value)} className="w-6 h-6" title="Highlight Color"/>
                </div>
                <div className="w-px h-5 bg-gray-400"></div>
                 <div className="flex items-center gap-1">
                    <button onClick={() => applyFormat('justifyLeft')} className="p-2 rounded hover:bg-gray-300">L</button>
                    <button onClick={() => applyFormat('justifyCenter')} className="p-2 rounded hover:bg-gray-300">C</button>
                    <button onClick={() => applyFormat('justifyRight')} className="p-2 rounded hover:bg-gray-300">R</button>
                    <button onClick={() => applyFormat('insertUnorderedList')} className="p-2 rounded hover:bg-gray-300">UL</button>
                    <button onClick={() => applyFormat('insertOrderedList')} className="p-2 rounded hover:bg-gray-300">OL</button>
                </div>
            </div>
            <div ref={editorRef} contentEditable dangerouslySetInnerHTML={{ __html: file?.content || '' }} className="flex-grow p-8 bg-white overflow-y-auto focus:outline-none" />
        </div>
    );
};

type CellData = { value: string; style?: React.CSSProperties };
const ExcelComponent: React.FC<Partial<AppProps>> = ({ file, setFs }) => {
    const [grid, setGrid] = useState<CellData[][]>(() => {
        if (file?.content) {
            try { return JSON.parse(file.content); } catch { /* fallthrough */ }
        }
        return Array.from({ length: 100 }, () => Array(26).fill({ value: '' }));
    });
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
    const [currentFile, setCurrentFile] = useState(file);

    const handleCellChange = (row: number, col: number, value: string) => {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = { ...newGrid[row][col], value };
        setGrid(newGrid);
    };
    
    const applyStyle = (style: React.CSSProperties) => {
        const { row, col } = selectedCell;
        const newGrid = grid.map(r => [...r]);
        const currentStyle = newGrid[row][col].style || {};
        newGrid[row][col] = { ...newGrid[row][col], style: { ...currentStyle, ...style } };
        setGrid(newGrid);
    };

    const handleSave = () => {
        let fileName = currentFile?.name;
        if (!fileName) fileName = prompt("Save as:", "spreadsheet.xls") || undefined;
        if (!fileName || !setFs) return;
        
        const finalName = fileName.endsWith('.xls') ? fileName : `${fileName}.xls`;
        setFs(fs => saveFileToFS(fs, [], finalName, JSON.stringify(grid)));
        setCurrentFile({ name: finalName, content: JSON.stringify(grid) });
        alert("Spreadsheet saved!");
    };
    
    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black text-sm">
            <div className="flex-shrink-0 p-1 bg-gray-200 flex items-center gap-2 border-b border-gray-300">
                <button onClick={handleSave} className="p-2 rounded hover:bg-gray-300">Save</button>
                <div className="w-px h-5 bg-gray-400"></div>
                <button onClick={() => applyStyle({ fontWeight: grid[selectedCell.row][selectedCell.col].style?.fontWeight === 'bold' ? 'normal' : 'bold' })} className="font-bold p-2 rounded hover:bg-gray-300">B</button>
                <button onClick={() => applyStyle({ fontStyle: grid[selectedCell.row][selectedCell.col].style?.fontStyle === 'italic' ? 'normal' : 'italic' })} className="italic p-2 rounded hover:bg-gray-300">I</button>
                <input type="color" onChange={e => applyStyle({ color: e.target.value })} title="Text Color" />
                <input type="color" onChange={e => applyStyle({ backgroundColor: e.target.value })} title="Cell Color" />
            </div>
            <div className="flex-grow overflow-auto">
                <table>
                    <thead><tr><th></th>{Array.from({length: 26}, (_, i) => <th key={i}>{String.fromCharCode(65+i)}</th>)}</tr></thead>
                    <tbody>
                        {grid.map((row, r) => <tr key={r}><th>{r+1}</th>{row.map((cell, c) => <td key={c}><input type="text" value={cell.value} style={cell.style} onFocus={() => setSelectedCell({row: r, col: c})} onChange={e => handleCellChange(r, c, e.target.value)} className={`w-full h-full px-1.5 py-1 box-border focus:outline-none ${selectedCell.row === r && selectedCell.col === c ? 'ring-2 ring-green-600' : ''}`} /></td>)}</tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const OutlookComponent: React.FC<Partial<AppProps>> = () => {
    const mockEmails = [{ id: 1, from: 'Patrick Blanks', subject: 'Welcome to Maxfra Office', body: 'This is the new Outlook clone.', date: '9:30 AM', read: false }];
    const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]);
    return (
        <div className="w-full h-full flex bg-white text-black">
            <div className="w-56 bg-gray-100 p-2 border-r"><h2 className="text-lg font-bold p-2">Mail</h2></div>
            <div className="w-96 border-r">{mockEmails.map(email => <button key={email.id} onClick={() => setSelectedEmail(email)} className="w-full text-left p-3 border-b">{email.subject}</button>)}</div>
            <div className="flex-grow p-6">{selectedEmail ? <div><h1 className="text-2xl font-bold">{selectedEmail.subject}</h1><p>{selectedEmail.body}</p></div>: 'Select an item'}</div>
        </div>
    );
};

export const MaxfraOfficeSuiteApp: React.FC<Partial<AppProps>> = (props) => {
    type OfficeApp = 'word' | 'excel' | 'outlook';
    const [activeApp, setActiveApp] = useState<OfficeApp>('word');

    useEffect(() => {
        if (props.file?.subApp) {
            setActiveApp(props.file.subApp);
        }
    }, [props.file]);

    const renderActiveAppComponent = () => {
        switch (activeApp) {
            case 'word': return <WordComponent {...props} />;
            case 'excel': return <ExcelComponent {...props} />;
            case 'outlook': return <OutlookComponent {...props} />;
            default: return null;
        }
    };
    
    return (
        <div className="w-full h-full flex bg-gray-800 text-white">
            <div className="w-16 bg-gray-900 flex flex-col items-center py-4">
                 <button onClick={() => setActiveApp('word')} className={`p-3 rounded-lg mb-4 ${activeApp === 'word' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="Word">
                    <MaxfraWordIcon className="w-6 h-6" />
                </button>
                 <button onClick={() => setActiveApp('excel')} className={`p-3 rounded-lg mb-4 ${activeApp === 'excel' ? 'bg-green-700' : 'hover:bg-gray-700'}`} title="Excel">
                    <MaxfraExcelIcon className="w-6 h-6" />
                </button>
                 <button onClick={() => setActiveApp('outlook')} className={`p-3 rounded-lg ${activeApp === 'outlook' ? 'bg-sky-600' : 'hover:bg-gray-700'}`} title="Outlook">
                    <MaxfraOutlookIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-grow">
                {renderActiveAppComponent()}
            </div>
        </div>
    );
};