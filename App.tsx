import React, { useState, useCallback, useRef, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import { APPS, MAXFRA_LOGO_B64 } from './constants';
import { WindowsLogoIcon } from './components/icons';
import type { WindowState, FSNode, FileData, DirectoryNode, Student } from './types';

const BACKGROUNDS = {
  default: `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#0078D7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#002050;stop-opacity:1" />
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#grad1)" />
</svg>`,
  sunset: `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a0e63;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#e13680;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffcc80;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sunsetGrad)" />
</svg>`,
  matrix: `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="matrixGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" />
      <stop offset="100%" stop-color="#0d2a0d" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#matrixGrad)" />
</svg>`,
};

const getInitialFileSystem = (): DirectoryNode => {
    // Define types locally for seeding, to avoid complex imports
    type StudentForSeed = Partial<Student> & {
      id: string;
      firstName: string;
      paternalLastName: string;
      mobilePhone: string;
    };
    
    type AppointmentForSeed = {
      id: string;
      location: 'Perisur' | 'Cd Brisas' | 'Polanco';
      date: string;
      time: string;
      studentId: string;
      studentName?: string; // Add studentName for easier display in appointments
      teacher: 'Fernando' | 'Maggi' | 'Rosi';
      type: 'Course' | 'Special';
      details: string; // Course or Special name
      attendance?: 'Pending' | 'Present' | 'Absent';
      notes?: string;
    };

    const sampleStudents: StudentForSeed[] = [
        { id: 'student-1', firstName: 'Ana', paternalLastName: 'García', maternalLastName: 'Pérez', mobilePhone: '5512345678', paymentStatus: 'Paid', diplomaStatus: 'Issued' },
        { id: 'student-2', firstName: 'Luis', paternalLastName: 'Martínez', maternalLastName: 'Rodríguez', mobilePhone: '5523456789', paymentStatus: 'Pending', diplomaStatus: 'Not Available' },
        { id: 'student-3', firstName: 'Sofía', paternalLastName: 'Hernández', maternalLastName: 'López', mobilePhone: '5534567890', paymentStatus: 'Paid', diplomaStatus: 'Available' },
        { id: 'student-4', firstName: 'Carlos', paternalLastName: 'Gómez', maternalLastName: 'González', mobilePhone: '5545678901', paymentStatus: 'Partial', diplomaStatus: 'Not Available' },
        { id: 'student-5', firstName: 'María', paternalLastName: 'Torres', maternalLastName: 'Díaz', mobilePhone: '5556789012', paymentStatus: 'Paid', diplomaStatus: 'Issued' }
    ];

    const today = new Date();
    
    const getNextValidDay = (date: Date): Date => {
        let newDate = new Date(date);
        let dayOfWeek = newDate.getDay();
        // AppointmentModal blocks Sunday (0) and Monday (1)
        while(dayOfWeek === 0 || dayOfWeek === 1) { 
            newDate.setDate(newDate.getDate() + 1);
            dayOfWeek = newDate.getDay();
        }
        return newDate;
    }
    
    const validToday = getNextValidDay(today);
    
    const tomorrow = new Date(validToday);
    tomorrow.setDate(validToday.getDate() + 1);
    const validTomorrow = getNextValidDay(tomorrow);

    const dayAfter = new Date(validTomorrow);
    dayAfter.setDate(validTomorrow.getDate() + 1);
    const validDayAfter = getNextValidDay(dayAfter);

    const formatDate = (date: Date) => date.toISOString().slice(0, 10);

    const sampleAppointments: AppointmentForSeed[] = [
        { id: 'app-1', location: 'Perisur', date: formatDate(validToday), time: '10:00', studentId: 'student-1', studentName: 'Ana García', teacher: 'Fernando', type: 'Course', details: 'Microblading', attendance: 'Pending' },
        { id: 'app-2', location: 'Perisur', date: formatDate(validToday), time: '10:00', studentId: 'student-2', studentName: 'Luis Martínez', teacher: 'Fernando', type: 'Course', details: 'Microblading', attendance: 'Pending' },
        { id: 'app-3', location: 'Perisur', date: formatDate(validToday), time: '10:00', studentId: 'student-4', studentName: 'Carlos Gómez', teacher: 'Fernando', type: 'Course', details: 'Microblading', attendance: 'Pending' },
        { id: 'app-4', location: 'Polanco', date: formatDate(validToday), time: '12:00', studentId: 'student-3', studentName: 'Sofía Hernández', teacher: 'Maggi', type: 'Course', details: 'Lash Lifting', attendance: 'Pending', notes: "Student asked to review the new serum." },
        { id: 'app-5', location: 'Cd Brisas', date: formatDate(validToday), time: '15:00', studentId: 'student-5', studentName: 'María Torres', teacher: 'Rosi', type: 'Special', details: 'Information', attendance: 'Present' },
        { id: 'app-6', location: 'Perisur', date: formatDate(validTomorrow), time: '10:00', studentId: 'student-5', studentName: 'María Torres', teacher: 'Fernando', type: 'Course', details: 'Eyelash Extensions', attendance: 'Pending' },
        { id: 'app-7', location: 'Perisur', date: formatDate(validTomorrow), time: '10:00', studentId: 'student-1', studentName: 'Ana García', teacher: 'Fernando', type: 'Course', details: 'Eyelash Extensions', attendance: 'Pending' },
        { id: 'app-8', location: 'Cd Brisas', date: formatDate(validTomorrow), time: '14:00', studentId: 'student-2', studentName: 'Luis Martínez', teacher: 'Rosi', type: 'Course', details: 'Hena', attendance: 'Pending' },
        { id: 'app-9', location: 'Polanco', date: formatDate(validDayAfter), time: '16:00', studentId: 'student-3', studentName: 'Sofía Hernández', teacher: 'Maggi', type: 'Special', details: 'Pickup Diploma', attendance: 'Pending' },
        { id: 'app-10', location: 'Perisur', date: formatDate(validDayAfter), time: '10:00', studentId: 'student-4', studentName: 'Carlos Gómez', teacher: 'Fernando', type: 'Course', details: 'Microblading', attendance: 'Pending' }
    ];
    
    const studentsFileContent = JSON.stringify(sampleStudents, null, 2);
    const appointmentsFileContent = JSON.stringify(sampleAppointments, null, 2);

    return {
        type: 'directory',
        name: 'root',
        children: [
            { type: 'directory', name: 'Documents', children: [
                { type: 'file', name: 'resume.txt', content: 'This is a resume.' },
            ]},
            { type: 'directory', name: 'Pictures', children: [] },
            { type: 'directory', name: 'system', children: [
                { type: 'file', name: 'maxfra-students.json', content: studentsFileContent },
                { type: 'file', name: 'maxfra-appointments.json', content: appointmentsFileContent },
                { type: 'file', name: 'maxfra-check-in-log.json', content: '[]' }, // Added check-in log file
                { type: 'file', name: 'maxfra-transactions.json', content: '[]' },
            ]},
            { type: 'file', name: 'system.config', content: 'Initial system configuration.' },
        ]
    };
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [backgroundId, setBackgroundId] = useState('default');
  const [fs, setFs] = useState<FSNode>(() => {
    try {
        const savedFs = localStorage.getItem('maxfra-filesystem');
        if (savedFs) {
            const parsed = JSON.parse(savedFs) as DirectoryNode;
            // Check if the filesystem has the seeded data structure. If so, use it.
            const systemDir = parsed.children.find((c): c is DirectoryNode => c.name === 'system' && c.type === 'directory');
            if (systemDir) {
                const appointmentsFile = systemDir.children.find(f => f.name === 'maxfra-appointments.json');
                const checkInLogFile = systemDir.children.find(f => f.name === 'maxfra-check-in-log.json'); // Check for check-in log
                if (appointmentsFile && checkInLogFile) { // Ensure both exist
                    return parsed; 
                }
            }
        }
    } catch (e) {
        console.error("Failed to load or parse filesystem from localStorage, creating a new one.", e);
    }
    // If localStorage is empty, invalid, or has an old structure, generate a fresh filesystem with sample data.
    return getInitialFileSystem();
  });
  const zIndexCounter = useRef(10);

  useEffect(() => {
    const savedBg = localStorage.getItem('maxfra-os-background') as keyof typeof BACKGROUNDS | null;
    if (savedBg && BACKGROUNDS[savedBg]) {
        setBackgroundId(savedBg);
    }
    
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'maxfra-os-background' && e.newValue && BACKGROUNDS[e.newValue as keyof typeof BACKGROUNDS]) {
            setBackgroundId(e.newValue);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  useEffect(() => {
    try {
        localStorage.setItem('maxfra-filesystem', JSON.stringify(fs));
    } catch (error) {
        console.error("Failed to save filesystem to localStorage", error);
    }
  }, [fs]);


  const openApp = useCallback((appId: string, file?: FileData) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.appId === appId && !file); // Only reuse if not opening a file
      if (existingWindow) {
        const newZ = zIndexCounter.current + 1;
        zIndexCounter.current = newZ;
        setActiveWindowId(existingWindow.id);
        return prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: newZ } : w);
      }
      
      const appConfig = APPS.find(app => app.id === appId);
      if (!appConfig) return prev;

      const newWindowId = `${appId}-${Date.now()}`;
      zIndexCounter.current += 1;
      
      const newWindow: WindowState = {
        id: newWindowId,
        appId: appConfig.id,
        title: file ? `${file.name} - ${appConfig.title}` : appConfig.title,
        icon: appConfig.icon,
        position: { x: 50 + prev.length * 20, y: 50 + prev.length * 20 },
        size: appConfig.defaultSize || { width: 640, height: 480 },
        isMinimized: false,
        isMaximized: false,
        zIndex: zIndexCounter.current,
        component: appConfig.component,
        file: file,
      };
      setActiveWindowId(newWindowId);
      return [...prev, newWindow];
    });
    setStartMenuOpen(false);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
        setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    if (id === activeWindowId) {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
        return;
    }
    zIndexCounter.current += 1;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter.current, isMinimized: false } : w));
    setActiveWindowId(id);
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id:string) => {
      setWindows(prev => prev.map(w => w.id === id ? {...w, isMinimized: true } : w));
      if (id === activeWindowId) {
          const nextWindow = windows.filter(w => !w.isMinimized && w.id !== id).sort((a,b) => b.zIndex - a.zIndex)[0];
          setActiveWindowId(nextWindow?.id || null);
      }
  }, [windows, activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  }, [focusWindow]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w));
  }, []);
  
  const updateWindowSize = useCallback((id: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position, size } : w));
  }, []);

  const backgroundSvg = BACKGROUNDS[backgroundId as keyof typeof BACKGROUNDS] || BACKGROUNDS.default;
  const backgroundImageUrl = `url("data:image/svg+xml,${encodeURIComponent(backgroundSvg)}")`;

  return (
    <div className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: backgroundImageUrl }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
        <div className="flex items-center gap-4">
            {/* FIX: Call WindowsLogoIcon as a function */}
            {WindowsLogoIcon("h-24 w-24")}
            <img src={MAXFRA_LOGO_B64} alt="Maxfra Academy Logo" className={`h-32 w-32 opacity-90 ${backgroundId === 'matrix' ? 'invert' : ''}`} />
        </div>
        <h1 className="text-4xl font-light text-white mt-6 [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]">
            Maxfra Academy OS
        </h1>
      </div>
      <Desktop apps={APPS} openApp={openApp} />
      
      {windows.map(ws => (
        <Window
          key={ws.id}
          windowState={ws}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onDrag={updateWindowPosition}
          onResize={updateWindowSize}
          isActive={ws.id === activeWindowId}
          fs={fs}
          setFs={setFs}
          openApp={openApp}
        />
      ))}

      <StartMenu
        isOpen={isStartMenuOpen}
        apps={APPS}
        openApp={openApp}
        closeStartMenu={() => setStartMenuOpen(false)}
      />
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        toggleStartMenu={() => setStartMenuOpen(prev => !prev)}
        openApp={openApp}
        focusWindow={focusWindow}
        minimizeWindow={minimizeWindow}
      />
    </div>
  );
};

export default App;