import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { AppProps, Student, Appointment, CheckInLog } from '../types';
import { SearchIcon, CheckInIcon, WhatsAppIcon, ShareIcon, CloseIcon, MaxfraLogoIcon } from '../components/icons';
import { MAXFRA_LOGO_B64 } from '../constants';

// --- Filesystem Utilities (duplicated for self-containment, ideally imported) ---
const findNodeByPath = (root: any, path: string[]): any | null => {
    if (root.type !== 'directory') return null;
    let currentNode: any = root;
    for (const part of path) {
        const nextNode = currentNode.children.find((child: any) => child.name === part && child.type === 'directory') as any | undefined;
        if (!nextNode) return null;
        currentNode = nextNode;
    }
    return currentNode;
};

const findOrCreateDirectoryByPath = (root: any, path: string[]): any => {
    let currentNode = root;
    for (const part of path) {
        let nextNode = currentNode.children.find((child: any) => child.name === part && child.type === 'directory') as any | undefined;
        if (!nextNode) {
            const newDir: any = { type: 'directory', name: part, children: [] };
            currentNode.children.push(newDir);
            currentNode = newDir;
        } else {
            currentNode = nextNode;
        }
    }
    return currentNode;
};

const saveFileToFS = (root: any, path: string[], fileName: string, content: string): any => {
    const newRoot = JSON.parse(JSON.stringify(root)) as any;
    if (newRoot.type !== 'directory') return root;

    const directory = findOrCreateDirectoryByPath(newRoot, path);

    const existingFileIndex = directory.children.findIndex((child: any) => child.name === fileName && child.type === 'file');
    if (existingFileIndex > -1) {
        (directory.children[existingFileIndex] as any).content = content;
    } else {
        directory.children.push({ type: 'file', name: fileName, content });
    }
    
    return newRoot;
};

// --- Constant File Paths ---
const APPOINTMENTS_FILE_PATH = ['system'];
const STUDENTS_FILE_NAME = 'maxfra-students.json';
const APPOINTMENTS_FILE_NAME = 'maxfra-appointments.json';
const CHECK_IN_LOG_FILE_NAME = 'maxfra-check-in-log.json';

// --- Utility Components (duplicated for self-containment, ideally imported) ---
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


const QRCode = ({ data, size = 128 }: { data: string, size?: number }) => {
    if (!data) return null;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=${size}x${size}&bgcolor=ffffff&qzone=1`;
    return <img src={qrUrl} alt="QR Code" width={size} height={size} className="border" />;
};

const formatDateKey = (date: Date): string => date.toISOString().slice(0, 10);

export const CheckInApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [signingAppointment, setSigningAppointment] = useState<Appointment | null>(null);
    const [confirmationSlipData, setConfirmationSlipData] = useState<{ student: Student, appointment: Appointment, checkInLog: CheckInLog } | null>(null);

    // --- Data Loading Effect ---
    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, APPOINTMENTS_FILE_PATH);
        
        const studentsFile = dir?.children.find((f: any) => f.name === STUDENTS_FILE_NAME && f.type === 'file') as any | undefined;
        if (studentsFile) {
            try { setStudents(JSON.parse(studentsFile.content)); } 
            catch (e) { console.error("Failed to parse students file", e); }
        }

        const appointmentsFile = dir?.children.find((f: any) => f.name === APPOINTMENTS_FILE_NAME && f.type === 'file') as any | undefined;
        if (appointmentsFile) {
            try { setAppointments(JSON.parse(appointmentsFile.content)); } 
            catch (e) { console.error("Failed to parse appointments file", e); }
        }

        const checkInLogFile = dir?.children.find((f: any) => f.name === CHECK_IN_LOG_FILE_NAME && f.type === 'file') as any | undefined;
        if (checkInLogFile) {
            try { setCheckInLogs(JSON.parse(checkInLogFile.content)); }
            catch (e) { console.error("Failed to parse check-in log file", e); }
        }
    }, [fs]);

    // --- Data Saving Functions ---
    const saveAppointments = useCallback((updatedAppointments: Appointment[]) => {
        if (!setFs) return;
        setAppointments(updatedAppointments);
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, APPOINTMENTS_FILE_NAME, JSON.stringify(updatedAppointments, null, 2)));
    }, [setFs]);

    const saveCheckInLogs = useCallback((updatedLogs: CheckInLog[]) => {
        if (!setFs) return;
        setCheckInLogs(updatedLogs);
        setFs(currentFs => saveFileToFS(currentFs, APPOINTMENTS_FILE_PATH, CHECK_IN_LOG_FILE_NAME, JSON.stringify(updatedLogs, null, 2)));
    }, [setFs]);

    // --- Search Logic ---
    const filteredStudents = useMemo(() => {
        if (!debouncedSearchQuery) return [];
        const query = debouncedSearchQuery.toLowerCase();
        return students.filter(student => 
            (student.id || '').toLowerCase().includes(query) ||
            (student.firstName || '').toLowerCase().includes(query) ||
            (student.paternalLastName || '').toLowerCase().includes(query) ||
            (student.maternalLastName || '').toLowerCase().includes(query) ||
            (student.mobilePhone || '').includes(query)
        );
    }, [debouncedSearchQuery, students]);

    const today = useMemo(() => formatDateKey(new Date()), []);

    const studentAppointmentsToday = useMemo(() => {
        if (!selectedStudent) return [];
        return appointments.filter(app => 
            app.studentId === selectedStudent.id && app.date === today
        ).sort((a,b) => a.time.localeCompare(b.time));
    }, [selectedStudent, appointments, today]);

    const isAppointmentCheckedIn = useCallback((appointmentId: string): boolean => {
        return checkInLogs.some(log => log.appointmentId === appointmentId);
    }, [checkInLogs]);

    const handleCheckIn = useCallback((appointment: Appointment, signature: string) => {
        if (!selectedStudent) return;

        const updatedAppointment: Appointment = { ...appointment, attendance: 'Present' };
        saveAppointments(appointments.map(app => app.id === appointment.id ? updatedAppointment : app));

        const newCheckInLog: CheckInLog = {
            id: `checkin-${Date.now()}`,
            studentId: selectedStudent.id,
            checkInTime: new Date().toISOString(),
            signature: signature,
            appointmentId: appointment.id,
        };
        saveCheckInLogs([...checkInLogs, newCheckInLog]);

        setSigningAppointment(null);
        setConfirmationSlipData({ student: selectedStudent, appointment: updatedAppointment, checkInLog: newCheckInLog });

    }, [selectedStudent, appointments, checkInLogs, saveAppointments, saveCheckInLogs]);

    // --- Confirmation Slip Actions ---
    const handleDownloadSlip = useCallback(async (format: 'jpg' | 'pdf') => {
        if (!confirmationSlipData) return;

        const { student, appointment, checkInLog } = confirmationSlipData;
        const slipElement = document.getElementById('confirmation-slip-content');
        if (!slipElement) return alert('Error: Slip content not found.');

        // Temporarily render to a hidden canvas to get image data
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
        const qrImg = await loadImg(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`MaxfraAppointmentCheckIn:${checkInLog.id}`)}&size=128x128&bgcolor=ffffff&qzone=1`);
        const sigImg = checkInLog.signature ? await loadImg(checkInLog.signature) : null;

        canvas.width = 400; // Fixed width for the slip
        canvas.height = 500; // Fixed height for the slip
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.drawImage(logoImg, 20, 20, 50, 50);
        ctx.fillStyle = '#1a202c'; // Dark gray for text
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Check-in Confirmation', canvas.width - 20, 50);
        
        ctx.textAlign = 'left';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Student:', 20, 100);
        ctx.font = '14px sans-serif';
        ctx.fillText(`${student.firstName} ${student.paternalLastName}`, 100, 100);
        ctx.fillText('Mobile:', 20, 120);
        ctx.fillText(student.mobilePhone, 100, 120);

        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Appointment Details:', 20, 160);
        ctx.font = '14px sans-serif';
        ctx.fillText(`Course: ${appointment.details}`, 20, 180);
        ctx.fillText(`Location: ${appointment.location}`, 20, 200);
        ctx.fillText(`Teacher: ${appointment.teacher}`, 20, 220);
        ctx.fillText(`Time: ${appointment.time} on ${new Date(appointment.date + 'T12:00:00').toLocaleDateString()}`, 20, 240);
        ctx.fillText(`Checked in: ${new Date(checkInLog.checkInTime).toLocaleTimeString()} - ${new Date(checkInLog.checkInTime).toLocaleDateString()}`, 20, 260);

        // QR Code
        ctx.drawImage(qrImg, canvas.width / 2 - qrImg.width / 2, 300, qrImg.width, qrImg.height);
        ctx.textAlign = 'center';
        ctx.font = '12px sans-serif';
        ctx.fillText('Scan for details', canvas.width / 2, 300 + qrImg.height + 15);

        // Signature
        if (sigImg) {
            ctx.textAlign = 'left';
            ctx.font = '14px sans-serif';
            ctx.fillText('Student Signature:', 20, canvas.height - 80);
            ctx.drawImage(sigImg, 20, canvas.height - 70, 120, 40);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = `checkin_slip_${student.id}_${appointment.id}.${format}`;
        link.href = dataUrl; // For both JPG and simple PDF (image based)
        link.click();
        
        if (format === 'pdf') {
            alert('PDF generation is a simple image-based PDF. For advanced PDFs, an external library is needed.');
        }

    }, [confirmationSlipData]);

    const handleShareWhatsApp = useCallback(() => {
        if (!confirmationSlipData) return;
        const { student, appointment } = confirmationSlipData;
        const message = `*Maxfra Academy Check-in Confirmation*\n\n` +
                        `*Student:* ${student.firstName} ${student.paternalLastName}\n` +
                        `*Course:* ${appointment.details}\n` +
                        `*Location:* ${appointment.location}\n` +
                        `*Teacher:* ${appointment.teacher}\n` +
                        `*Time:* ${appointment.time} on ${new Date(appointment.date + 'T12:00:00').toLocaleDateString()}\n\n` +
                        `Thank you for checking in!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }, [confirmationSlipData]);
    

    // --- UI Render ---
    const SignatureModal = ({ appointment, onSave, onCancel }: { appointment: Appointment, onSave: (sig: string) => void, onCancel: () => void }) => {
        const signatureRef = useRef<HTMLCanvasElement>(null);
        return (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={onCancel}>
                <div className="bg-white p-6 rounded-lg text-black w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()} aria-modal="true" role="dialog" aria-labelledby="signature-modal-title">
                    <h3 id="signature-modal-title" className="text-xl font-bold mb-2">Student Signature for {selectedStudent?.firstName}</h3>
                    <p className="text-sm text-gray-600 mb-4">Please sign below to confirm your check-in for the {appointment.details} appointment at {appointment.time}.</p>
                    <SignaturePad ref={signatureRef} width={400} height={200} onEnd={() => { /* nothing on end, save on button click */ }} />
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => {
                            const canvas = signatureRef.current;
                            if (canvas) {
                                const ctx = canvas.getContext('2d');
                                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                            }
                        }} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
                        <button onClick={() => {
                            const signature = signatureRef.current?.toDataURL();
                            if (signature) onSave(signature);
                            else alert("Please provide a signature.");
                        }} className="px-4 py-2 bg-blue-500 text-white rounded">Confirm Check-in</button>
                    </div>
                </div>
            </div>
        );
    };

    const ConfirmationSlipModal = ({ onClose }: { onClose: () => void }) => {
        if (!confirmationSlipData) return null;
        const { student, appointment, checkInLog } = confirmationSlipData;
        return (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[70]" onClick={onClose}>
                <div className="bg-white p-6 rounded-lg text-black w-full max-w-sm shadow-2xl flex flex-col items-center" onClick={e => e.stopPropagation()} aria-modal="true" role="dialog" aria-labelledby="slip-modal-title">
                    <h3 id="slip-modal-title" className="text-2xl font-bold mb-4 text-center">Check-in Confirmed!</h3>
                    
                    <div id="confirmation-slip-content" className="border border-gray-300 p-4 rounded-lg w-full bg-white flex flex-col items-center">
                        {/* FIX: Changed JSX component to function call for MaxfraLogoIcon */}
                        {MaxfraLogoIcon("w-16 h-16 mb-2")}
                        <h4 className="font-bold text-lg text-gray-800 mb-3 text-center">Appointment Slip</h4>
                        <div className="text-sm w-full space-y-1 mb-4">
                            <p><strong>Student:</strong> {student.firstName} {student.paternalLastName}</p>
                            <p><strong>Course:</strong> {appointment.details}</p>
                            <p><strong>Location:</strong> {appointment.location}</p>
                            <p><strong>Teacher:</strong> {appointment.teacher}</p>
                            <p><strong>Time:</strong> {appointment.time} on {new Date(appointment.date + 'T12:00:00').toLocaleDateString()}</p>
                            <p><strong>Checked in:</strong> {new Date(checkInLog.checkInTime).toLocaleTimeString()} - {new Date(checkInLog.checkInTime).toLocaleDateString()}</p>
                        </div>
                        <div className="my-4">
                            <QRCode data={`MaxfraAppointmentCheckIn:${checkInLog.id}`} size={128} />
                            <p className="text-xs text-center mt-1 text-gray-500">Scan for details</p>
                        </div>
                        {checkInLog.signature && (
                            <div className="w-full text-center">
                                <p className="text-xs text-gray-600 mb-1">Student Signature:</p>
                                <img src={checkInLog.signature} alt="Student Signature" className="h-16 w-32 object-contain mx-auto border" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-4">
                        <button onClick={() => handleDownloadSlip('jpg')} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2">
                            {/* FIX: Changed JSX component to function call for ShareIcon */}
                            {ShareIcon("w-5 h-5")} Download JPG
                        </button>
                        <button onClick={() => handleDownloadSlip('pdf')} className="px-4 py-2 bg-purple-500 text-white rounded flex items-center justify-center gap-2">
                             {/* FIX: Changed JSX component to function call for ShareIcon */}
                             {ShareIcon("w-5 h-5")} Save as PDF
                        </button>
                        <button onClick={handleShareWhatsApp} className="px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center gap-2">
                             {/* FIX: Changed JSX component to function call for WhatsAppIcon */}
                             {WhatsAppIcon("w-5 h-5")} Share on WhatsApp
                        </button>
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mt-2">Close</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black p-4 select-none font-sans relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                {/* FIX: Changed JSX component to function call for CheckInIcon */}
                {CheckInIcon("w-8 h-8")} Student Check-in
            </h2>

            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* FIX: Changed JSX component to function call for SearchIcon */}
                    {SearchIcon("text-gray-400")}
                </div>
                <input
                    type="text"
                    placeholder="Search by ID, name, or phone number..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedStudent(null);
                    }}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    aria-label="Search student"
                />
                {searchQuery && filteredStudents.length > 0 && !selectedStudent && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => {
                                    setSelectedStudent(student);
                                    setSearchQuery(`${student.firstName} ${student.paternalLastName}`);
                                }}
                                className="w-full text-left p-3 hover:bg-blue-50/50 border-b last:border-b-0 flex flex-col"
                                aria-label={`Select student ${student.firstName} ${student.paternalLastName}`}
                            >
                                <p className="font-semibold">{student.firstName} {student.paternalLastName} ({student.id})</p>
                                <p className="text-xs text-gray-500">{student.mobilePhone}</p>
                            </button>
                        ))}
                    </div>
                )}
                {searchQuery && filteredStudents.length === 0 && !selectedStudent && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3 text-gray-500">
                        No students found.
                    </div>
                )}
            </div>

            {selectedStudent && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Selected Student: {selectedStudent.firstName} {selectedStudent.paternalLastName}</h3>
                    <p className="text-gray-600 text-sm">ID: {selectedStudent.id} | Phone: {selectedStudent.mobilePhone}</p>
                </div>
            )}

            <div className="flex-grow bg-white p-4 rounded-lg shadow overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Today's Appointments</h3>
                {selectedStudent ? (
                    studentAppointmentsToday.length > 0 ? (
                        <div className="space-y-3">
                            {studentAppointmentsToday.map(appointment => {
                                const checkedIn = isAppointmentCheckedIn(appointment.id);
                                return (
                                    <div key={appointment.id} className="border border-gray-200 rounded-md p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-lg">{appointment.details} ({appointment.type})</p>
                                            <p className="text-gray-600 text-sm">{appointment.location} | {appointment.teacher} | {appointment.time}</p>
                                        </div>
                                        {checkedIn ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Checked In</span>
                                        ) : (
                                            <button
                                                onClick={() => setSigningAppointment(appointment)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                                aria-label={`Check in for ${appointment.details} at ${appointment.time}`}
                                            >
                                                Check-in
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No appointments for today.</p>
                    )
                ) : (
                    <p className="text-gray-500 text-center py-10">Please select a student to view their appointments.</p>
                )}
            </div>

            {signingAppointment && selectedStudent && (
                <SignatureModal 
                    appointment={signingAppointment} 
                    onSave={(signature) => handleCheckIn(signingAppointment, signature)} 
                    onCancel={() => setSigningAppointment(null)} 
                />
            )}

            {confirmationSlipData && (
                <ConfirmationSlipModal onClose={() => setConfirmationSlipData(null)} />
            )}
        </div>
    );
};