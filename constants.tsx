

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
    MaxfraOfficeSuiteApp, // FIX: Imported MaxfraOfficeSuiteApp
    StudentDatabaseApp,
    CheckInApp, // Imported CheckInApp
    MaxfraLibraryApp, // FIX: Imported MaxfraLibraryApp
    ImageViewerApp // FIX: Imported ImageViewerApp
} from './apps';

// MAXFRA Logo Base64 - PNG with transparent background
export const MAXFRA_LOGO_B64 = 'data:image/png;base64,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';

// Fix: Export the APPS constant
export const APPS: AppConfig[] = [
  {
    id: 'notepad',
    title: 'Notepad',
    icon: Icons.NotepadIcon,
    component: NotepadApp,
    isPinned: true,
    defaultSize: { width: 600, height: 400 },
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
    id: 'browser',
    title: 'Maxfra AI Browser',
    icon: Icons.MaxfraAIBrowserIcon,
    component: MaxfraAiBrowserApp,
    isPinned: true,
    defaultSize: { width: 1024, height: 768 },
  },
  {
    id: 'studentDatabase',
    title: 'Student Database',
    icon: Icons.StudentDatabaseIcon,
    component: StudentDatabaseApp,
    isPinned: true,
    defaultSize: { width: 1200, height: 800 },
  },
  {
    id: 'checkIn',
    title: 'Student Check-in',
    icon: Icons.CheckInIcon,
    component: CheckInApp, // Use the new CheckInApp component
    isPinned: true,
    defaultSize: { width: 500, height: 650 },
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
    id: 'settings',
    title: 'Settings',
    icon: Icons.SettingsIcon,
    component: SettingsApp,
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: 'calculator',
    title: 'Finance Calculator',
    icon: Icons.CalculatorIcon,
    component: CalculatorApp,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'clipCalculator',
    title: 'Clip Commission Calculator',
    icon: Icons.ClipIcon,
    component: ClipCalculatorApp,
    defaultSize: { width: 450, height: 700 },
  },
  {
    id: 'maxfraOfficeSuite',
    title: 'Maxfra Office Suite',
    icon: Icons.MaxfraOfficeSuiteIcon, // FIX: Use the imported MaxfraOfficeSuiteIcon
    component: MaxfraOfficeSuiteApp,
    defaultSize: { width: 1024, height: 768 },
  },
  {
    id: 'library',
    title: 'Maxfra Library',
    icon: Icons.LibraryIcon, // FIX: Use the imported LibraryIcon
    component: MaxfraLibraryApp,
    defaultSize: { width: 900, height: 700 },
  },
  {
    id: 'imageViewer',
    title: 'Image Viewer',
    icon: Icons.ImageIcon, // FIX: Use the imported ImageIcon
    component: ImageViewerApp,
    defaultSize: { width: 800, height: 600 },
  }
];


// --- Library App Resources ---
export const COLOR_THEORY_B64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYVFRgVFRUYGBgYGBgYGBgYGBgYGBgYGBgZGRgYGBgcIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJCs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDT/wAARCAH5A/IDASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAQACAwQFBgcI/8QAThAAAQMCAwQGBQUMBwkAAwEAAQACAwQRBRIhBhMxQVEiYXGBkaEHFCNCUrHB0fAVM2JygpKy4SQ0NUNTY3SDwuLxFiU1VWRzo6TC/8QAGwEAAgMBAQEAAAAAAAAAAAAAAQIAAwQFBgf/xAA1EQACAgEDAgMGBgICAwEAAAAAAQIRAwQSITFBURMiYTJxgZGhFEJSscHR8BVS4QYjYvEz/9oADAMBAAoSAPwD54xS9R4g77U5SgI+rUaRz6nI849FmF1aE+q0K0jY569JgL3u9E/u81fX6K4a+sQLXoR1Kq70607K+96HVDXoBYL0S9V3vRr0AqNbpWlVtejXoDZW3vRrvRve1O3vQFbXo19tStetfbYBYLXWp2vRr7bAVt71fd6IvbX29AWB1NfWp+vRr7bAVtfbUrXrT3oBb1Jepu96JegFi9GvU970S/QLA69GvU16a+QFi9Fep7pL0AtevS3qa9NfkBYL0K5P1V3I19tALAtU3J+qGvVr9ALXqVqmvT1iBY16a9T1iFiBYvS3pK9JegE3oR0pL0JegN1bp65I19tK16A2W3vVr7am3vWrXoDbWvWtTte1JeqBW9WtStelcgFi9Eoq5KgWKSi7pKAWC9EvS3pKAUC9Fepb0lAKi9Eqa5KgWLVNckqS5ALFqGqS9JegFq1KgqS9ALFyGqS9JegFi5GuS3pL0AtfpL1NekvQCt+kvVF+kEAtfp16ov0lAK36leg16e5AKl6legr0l6AVK1I1JcgFilcgLktyAWKU1ykuS3IBYvSXKSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS3IBYvS3qSuS-p-q-s-c-c-1-e-n-c-i-o-u-s-l-y- -a-n-d- -s-t-e-p-s- -f-o-r-w-a-r-d- -o-n-c-e- -h-e- -h-a-s- -d-o-n-e- -s-o-.- - -“I am quite curious as to what it is that you want with me,” he declares, his voice level and smooth. “There aren’t many who are capable of such… ‘negotiating,’ for lack of a better term.”';

// Fix: Export the LIBRARY_IMAGES constant
export const LIBRARY_IMAGES = [
    {
        title: 'Color Theory for Makeup',
        src: COLOR_THEORY_B64,
    },
    {
        title: 'Anatomy of the Face',
        src: COLOR_THEORY_B64, // Placeholder, using same image
    },
];