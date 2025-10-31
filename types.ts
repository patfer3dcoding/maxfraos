import type { ComponentType, JSX, Dispatch, SetStateAction } from 'react';

// --- File System & App Communication Types ---

export interface FileData {
    name: string;
    content: string;
    subApp?: 'word' | 'excel'; // To specify which part of a suite to open
}

export interface AppProps {
    fs: FSNode;
    setFs: Dispatch<SetStateAction<FSNode>>;
    openApp: (appId: string, file?: FileData) => void;
    closeWindow: () => void;
    file?: FileData; // The file an app is opened with
    windowId: string;
}

// --- Core OS & App Configuration Types ---

export interface AppConfig {
  id: string;
  title: string;
  icon: (className?: string) => JSX.Element;
  component: ComponentType<Partial<AppProps>>; // All apps receive AppProps
  isPinned?: boolean;
  defaultSize?: { width: number; height: number };
}

export interface WindowState {
  id:string;
  appId: string;
  title: string;
  icon: (className?: string) => JSX.Element;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: ComponentType<Partial<AppProps>>;
  file?: FileData; // Pass file data to the window
}

// --- Student Database Type ---
export interface Student {
  id: string;
  // Course Info
  course?: string;
  courseDuration?: string;
  totalClasses?: string;
  startDate?: string;
  endDate?: string;
  registrationDate?: string;
  registrationCost?: string;
  totalCost?: string;
  monthlyPayment?: string;
  cashPayment?: string;
  downPayment?: string;
  paymentDate?: string;
  // Personal Info
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  dob?: string;
  nationality?: string;
  sex?: string;
  covidVaccine?: string;
  curp?: string;
  // Address
  addressStreet?: string;
  addressColonia?: string;
  addressDelegacion?: string;
  addressCp?: string;
  // Contact & Professional
  profession?: string;
  educationLevel?: string;
  homePhone?: string;
  allergies?: string;
  mobilePhone: string;
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPaternalLastName?: string;
  emergencyContactMaternalLastName?: string;
  emergencyContactDob?: string;
  emergencyContactNationality?: string;
  emergencyContactSex?: string;
  emergencyContactRelationship?: string;
  emergencyContactAddressStreet?: string;
  emergencyContactAddressColonia?: string;
  emergencyContactAddressDelegacion?: string;
  emergencyContactAddressCp?: string;
  emergencyContactHomePhone?: string;
  emergencyContactMobilePhone?: string;
  // Guardian (if minor)
  guardianName?: string;
  guardianPaternalLastName?: string;
  guardianMaternalLastName?: string;
  guardianDob?: string;
  guardianNationality?: string;
  guardianSex?: string;
  guardianAddressStreet?: string;
  guardianAddressColonia?: string;
  guardianAddressDelegacion?: string;
  guardianHomePhone?: string;
  guardianMobilePhone?: string;
  // New Tracking Fields
  paymentStatus?: 'Paid' | 'Pending' | 'Partial';
  diplomaStatus?: 'Available' | 'Issued' | 'Not Available';
  // Signature
  signature?: string; // base64 data URL
}

// --- Check-in Log Type ---
export interface CheckInLog {
  id: string;
  studentId: string;
  checkInTime: string; // ISO 8601 format
  signature: string; // base64 data URL
  appointmentId?: string;
}

// --- Finance Calculator Type ---
export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

// --- Appointment Book Type ---
export interface Appointment {
  id: string;
  location: 'Perisur' | 'Cd Brisas' | 'Polanco';
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  studentId?: string;
  studentName: string;
  teacher: 'Fernando' | 'Maggi' | 'Rosi';
  type: 'Course' | 'Special';
  details: string; // Course or Special name
  attendance?: 'Pending' | 'Present' | 'Absent';
  notes?: string;
  signature?: string; // base64 data URL for student signature
  learningLog?: string; // What was learned in the session
}


// --- File System Node Types ---

export interface DirectoryNode {
    type: 'directory';
    name: string;
    children: FSNode[];
}

export interface FileNode {
    type: 'file';
    name: string;
    content: string; // File content is now part of the node
}

export type FSNode = FileNode | DirectoryNode;