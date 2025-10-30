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
    CheckInApp
} from './apps';

// MAXFRA Logo Base64 - PNG with transparent background
export const MAXFRA_LOGO_B64 = 'data:image/png;base64,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';


export const APPS: AppConfig[] = [
  {
    id: 'notepad',
    title: 'Notepad',
    icon: (className) => <Icons.NotepadIcon className={className} />,
    component: NotepadApp,
    defaultSize: { width: 400, height: 300 },
  },
  {
    id: 'maxfraAiBrowser',
    title: 'MAXFRA AI Browser',
    icon: (className) => <Icons.MaxfraAIBrowserIcon className={className} />,
    component: MaxfraAiBrowserApp,
    isPinned: true,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'fileExplorer',
    title: 'File Explorer',
    icon: (className) => <Icons.FileExplorerIcon className={className} />,
    component: FileExplorerApp,
    isPinned: true,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: (className) => <Icons.SettingsIcon className={className} />,
    component: SettingsApp,
  },
  {
    id: 'studentDatabase',
    title: 'Student Database',
    icon: (className) => <Icons.StudentDatabaseIcon className={className} />,
    component: StudentDatabaseApp,
    isPinned: true,
    defaultSize: { width: 1024, height: 768 },
  },
  {
    id: 'checkIn',
    title: 'Student Check-in',
    icon: (className) => <Icons.CheckInIcon className={className} />,
    component: CheckInApp,
    isPinned: true,
    defaultSize: { width: 550, height: 650 },
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: (className) => <Icons.CalculatorIcon className={className} />,
    component: CalculatorApp,
    defaultSize: { width: 320, height: 480 },
  },
  {
    id: 'calendar',
    title: 'Maxfra Appointment Book',
    icon: (className) => <Icons.CalendarIcon className={className} />,
    component: CalendarApp,
    isPinned: true,
    defaultSize: { width: 900, height: 700 },
  },
  {
    id: 'clipCalculator',
    title: 'Clip Calculator',
    icon: (className) => <Icons.ClipIcon className={className} />,
    component: ClipCalculatorApp,
    defaultSize: { width: 500, height: 750 },
  },
  {
    id: 'maxfraOfficeSuite',
    title: 'Maxfra Office Suite',
    icon: (className) => <Icons.MaxfraOfficeSuiteIcon className={className} />,
    component: MaxfraOfficeSuiteApp,
    isPinned: true,
    defaultSize: { width: 950, height: 700 },
  },
];