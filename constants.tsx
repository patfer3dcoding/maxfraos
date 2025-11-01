import type { AppConfig } from './types';
import * as Icons from './components/icons';
import { 
    NotepadApp, 
    FileExplorerApp, 
    SettingsApp, 
    CalculatorApp, 
    MaxfraAiBrowserApp, 
    CalendarApp, 
    ClipCalculatorApp,
    MaxfraOfficeSuiteApp,
    StudentDatabaseApp,
    CheckInApp,
    MaxfraLibraryApp,
    ImageViewerApp
} from './apps/index';

// MAXFRA Logo Base64 - Replaced with a placeholder SVG to fix syntax error.
export const MAXFRA_LOGO_B64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDc4RDciLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5NPC90ZXh0Pgo8L3N2Zz4=';

// Placeholder data for the library app
export const LIBRARY_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1599388136367-29348a93442a?q=80&w=870&auto=format&fit=crop', title: 'Eyebrow Design' },
    { src: 'https://images.unsplash.com/photo-1556228852-50a3ac525f54?q=80&w=870&auto=format&fit=crop', title: 'Color Theory' },
    { src: 'https://images.unsplash.com/photo-1580920469279-844449171939?q=80&w=870&auto=format&fit=crop', title: 'Microblading Strokes' },
    { src: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=774&auto=format&fit=crop', title: 'Lash Application' },
    { src: 'https://images.unsplash.com/photo-1584444263679-a4708b76e273?q=80&w=870&auto=format&fit=crop', title: 'Sanitization' },
    { src: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=870&auto=format&fit=crop', title: 'Skin Types' },
    { src: 'https://images.unsplash.com/photo-1616394584742-a8c6c55a5b10?q=80&w=870&auto=format&fit=crop', title: 'Henna Mixing' },
    { src: 'https://images.unsplash.com/photo-1605333152739-2c78a3c94254?q=80&w=870&auto=format&fit=crop', title: 'Advanced Techniques' }
];

// Application configurations
export const APPS: AppConfig[] = [
  {
    id: 'studentDatabase',
    title: 'Student Database',
    icon: Icons.StudentDatabaseIcon,
    component: StudentDatabaseApp,
    isPinned: true,
    defaultSize: { width: 1200, height: 720 },
  },
  {
    id: 'calendar',
    title: 'Appointment Book',
    icon: Icons.CalendarIcon,
    component: CalendarApp,
    isPinned: true,
    defaultSize: { width: 1280, height: 800 },
  },
  {
    id: 'checkIn',
    title: 'Student Check-in',
    icon: Icons.CheckInIcon,
    component: CheckInApp,
    defaultSize: { width: 500, height: 700 },
  },
  {
    id: 'calculator',
    title: 'Finance Calculator',
    icon: Icons.CalculatorIcon,
    component: CalculatorApp,
    defaultSize: { width: 800, height: 500 },
  },
  {
    id: 'clipCalculator',
    title: 'Clip Calculator',
    icon: Icons.ClipIcon,
    component: ClipCalculatorApp,
    defaultSize: { width: 450, height: 750 },
  },
  {
    id: 'browser',
    title: 'Maxfra AI Browser',
    icon: Icons.MaxfraAIBrowserIcon,
    component: MaxfraAiBrowserApp,
    isPinned: true,
    defaultSize: { width: 1024, height: 768 },
  },
  {
    id: 'maxfraOfficeSuite',
    title: 'Maxfra Office Suite',
    icon: Icons.MaxfraOfficeSuiteIcon,
    component: MaxfraOfficeSuiteApp,
    defaultSize: { width: 720, height: 500 },
  },
  {
    id: 'library',
    title: 'Maxfra Library',
    icon: Icons.LibraryIcon,
    component: MaxfraLibraryApp,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: Icons.NotepadIcon,
    component: NotepadApp,
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: 'fileExplorer',
    title: 'File Explorer',
    icon: Icons.FileExplorerIcon,
    component: FileExplorerApp,
    isPinned: true,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Icons.SettingsIcon,
    component: SettingsApp,
    defaultSize: { width: 500, height: 400 },
  },
  // ImageViewer is not a launchable app from desktop/start menu
  // It's opened by other apps, so it's defined here for window creation.
  {
    id: 'imageViewer',
    title: 'Image Viewer',
    icon: Icons.ImageIcon,
    component: ImageViewerApp,
    defaultSize: { width: 800, height: 600 },
  }
];