import type { AppConfig, QuickReplyCategory } from './types';
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
    ImageViewerApp,
    QuickRepliesApp,
    WhiteboardApp,
} from './apps/index';

// Fix: Add missing export for the base64 encoded Maxfra logo.
export const MAXFRA_LOGO_B64 = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMTAwVjBIMjBWNzBMNTAgMjBMODAgNzBWMEgxMDBWMTAwSDgwTDUwIDUwTDIwIDEwMEgwWiIgZmlsbD0iI0Y5NjkyMSIvPjwvc3ZnPg==';

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

// --- Quick Replies Data ---
export const QUICK_REPLIES_DATA: QuickReplyCategory[] = [
    {
        id: 'welcome',
        title: 'Welcome & Info',
        icon: Icons.LibraryIcon,
        replies: [
            {
                title: 'General Welcome',
                message: '¡Hola! Bienvenido/a a Maxfra Academy. ¿En qué podemos ayudarte hoy?',
            },
            {
                title: 'Course Information Request',
                message: '¡Claro! Con gusto te comparto la información de nuestros cursos. ¿Hay alguno en particular que te interese? Tenemos Microblading, Extensiones de Pestañas, Henna, y más.',
            },
            {
                title: 'Our Locations',
                message: 'Nos puedes encontrar en nuestras sucursales de Perisur, Cd. Brisas y Polanco. ¿Te gustaría la dirección de alguna de ellas?',
            },
        ],
    },
    {
        id: 'courses',
        title: 'Courses & Pricing',
        icon: (className) => (
             <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
        ),
        replies: [
            {
                title: 'Microblading Course Price',
                message: 'El costo de nuestro curso de Microblading es de $XXXX. Incluye tu kit de inicio, manual y certificación. ¿Te gustaría conocer las próximas fechas?',
            },
            {
                title: 'Payment Methods',
                message: 'Aceptamos pagos con tarjeta de crédito/débito, transferencia bancaria y efectivo directamente en sucursal. También contamos con meses sin intereses (aplican comisiones).',
            },
            {
                title: 'Next Available Date',
                message: 'Nuestra próxima fecha de inicio para el curso de [NOMBRE DEL CURSO] es el [FECHA]. ¡El cupo es limitado! ¿Te gustaría que te apartemos un lugar?',
            },
        ],
    },
    {
        id: 'scheduling',
        title: 'Scheduling',
        icon: Icons.CalendarIcon,
        replies: [
            {
                title: 'Appointment Confirmation',
                message: '¡Confirmado! Tu cita para [SERVICIO] está agendada para el día [FECHA] a las [HORA] en nuestra sucursal de [LUGAR]. ¡Te esperamos!',
            },
            {
                title: 'Check Availability',
                message: 'Permíteme un momento para revisar la agenda. ¿Qué día y hora te funcionarían mejor?',
            },
            {
                title: 'Reschedule Request',
                message: 'Entendido. Para reagendar tu cita, por favor indícanos una nueva fecha y hora tentativas para verificar disponibilidad.',
            },
        ],
    },
    {
        id: 'follow_up',
        title: 'Follow-Up',
        icon: Icons.ReloadIcon,
        replies: [
            {
                title: 'Post-Appointment Care',
                message: '¡Hola! ¿Cómo te has sentido después de tu procedimiento? Recuerda seguir los cuidados que te indicamos. Estamos aquí para cualquier duda.',
            },
            {
                title: 'Feedback Request',
                message: 'Gracias por visitarnos. Nos encantaría conocer tu opinión sobre tu experiencia en Maxfra Academy. ¿Podrías regalarnos un momento para contarnos cómo te fue?',
            },
        ],
    },
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
    id: 'quickReplies',
    title: 'Quick Replies',
    icon: Icons.QuickRepliesIcon,
    component: QuickRepliesApp,
    isPinned: true,
    defaultSize: { width: 900, height: 600 },
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
    id: 'whiteboard',
    title: 'Whiteboard',
    icon: Icons.WhiteboardIcon,
    component: WhiteboardApp,
    defaultMaximized: true,
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