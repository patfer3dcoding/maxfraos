import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AppProps } from '../types';

// --- Filesystem Utilities (duplicated for self-containment) ---
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

const COLORS = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7'];
const SIZES = [2, 5, 10, 20];

export const WhiteboardApp: React.FC<Partial<AppProps>> = ({ file, setFs, windowId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawing = useRef(false);
    
    const [currentFile, setCurrentFile] = useState(file);
    const [color, setColor] = useState(COLORS[0]);
    const [size, setSize] = useState(SIZES[1]);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    // --- Canvas Initialization and Resizing ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        
        const setupCanvas = () => {
            const container = containerRef.current;
            if (!container) return;

            const { width, height } = container.getBoundingClientRect();
            
            // Preserve drawing on resize, only if canvas has dimensions
            const imageData = (canvas.width > 0 && canvas.height > 0)
                ? contextRef.current?.getImageData(0, 0, canvas.width, canvas.height)
                : undefined;

            canvas.width = width;
            canvas.height = height;
            
            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                contextRef.current = context;

                if (imageData) {
                    context.putImageData(imageData, 0, 0);
                }
            }
        };

        const resizeObserver = new ResizeObserver(setupCanvas);
        resizeObserver.observe(containerRef.current);
        
        // Initial setup
        setupCanvas();

        return () => resizeObserver.disconnect();
    }, []);

    // --- Load Initial Content (from file or auto-save) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;

        const loadContent = (dataUrl: string) => {
            const img = new Image();
            img.onload = () => {
                contextRef.current?.clearRect(0, 0, canvas.width, canvas.height);
                contextRef.current?.drawImage(img, 0, 0);
            };
            img.src = dataUrl;
        };

        if (file?.content) {
            loadContent(file.content);
        } else if (windowId) {
            try {
                const autoSavedContent = localStorage.getItem(`whiteboard-autosave-${windowId}`);
                if (autoSavedContent) {
                    loadContent(autoSavedContent);
                }
            } catch (e) {
                console.error("Failed to load whiteboard from localStorage", e);
            }
        }
    }, [file, windowId]);

    // --- Auto-Save Logic ---
    useEffect(() => {
        if (!windowId) return;

        const intervalId = setInterval(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                const autoSaveKey = `whiteboard-autosave-${currentFile?.name || windowId}`;
                try {
                    localStorage.setItem(autoSaveKey, canvas.toDataURL('image/png'));
                } catch (e) {
                    console.error("Failed to auto-save whiteboard to localStorage", e);
                }
            }
        }, 15000); // 15 seconds

        return () => clearInterval(intervalId);
    }, [windowId, currentFile]);

    // --- Drawing Handlers ---
    const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        const context = contextRef.current;
        if (!context) return;

        const { offsetX, offsetY } = getCoords(event);
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        isDrawing.current = true;
    }, []);

    const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        if (!isDrawing.current || !contextRef.current) return;
        
        const context = contextRef.current;
        context.strokeStyle = color;
        context.lineWidth = size;
        context.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
        
        const { offsetX, offsetY } = getCoords(event);
        context.lineTo(offsetX, offsetY);
        context.stroke();
    }, [color, size, tool]);

    const stopDrawing = useCallback(() => {
        const context = contextRef.current;
        if (!context) return;
        context.closePath();
        isDrawing.current = false;
    }, []);
    
    const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };
        const rect = canvas.getBoundingClientRect();
        
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
        };
    };

    // --- Toolbar Actions ---
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas || !setFs) return;
        
        let fileName = currentFile?.name;
        const wasNewFile = !fileName;
        
        if (!fileName) {
            fileName = prompt("Save as:", "drawing.wbd");
            if (!fileName) return;
            if (!fileName.endsWith('.wbd')) fileName += '.wbd';
        }
        
        const content = canvas.toDataURL('image/png');
        setFs(fs => saveFileToFS(fs, ['Documents'], fileName!, content));
        
        if (wasNewFile && windowId) {
            try {
                const oldAutoSaveKey = `whiteboard-autosave-${windowId}`;
                localStorage.removeItem(oldAutoSaveKey);
            } catch (e) {
                console.error("Failed to remove old autosave key", e);
            }
        }
        
        setCurrentFile({ name: fileName, content });
        alert("Whiteboard saved!");
    };
    
    const ToolButton = ({ children, isActive, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean, children: React.ReactNode }) => (
        <button {...props} className={`p-2 rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
            {children}
        </button>
    );

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black">
            <div className="flex-shrink-0 p-2 bg-white border-b flex items-center justify-between gap-4 shadow-sm flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold mr-2">Color:</span>
                    {COLORS.map(c => (
                        <button key={c} onClick={() => { setTool('pen'); setColor(c); }} className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: c, borderColor: color === c && tool === 'pen' ? '#3B82F6' : 'transparent' }} />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-sm font-semibold mr-2">Size:</span>
                     {SIZES.map(s => (
                         <button key={s} onClick={() => setSize(s)} className={`rounded-full flex items-center justify-center transition-colors ${size === s ? 'bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'}`} style={{ width: s + 12, height: s + 12 }}>
                             <div className="bg-black rounded-full" style={{ width: s, height: s }} />
                         </button>
                     ))}
                </div>
                 <div className="flex items-center gap-2">
                     <ToolButton onClick={() => setTool('eraser')} isActive={tool === 'eraser'}>
                         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 5.5c-1.8-1.8-4.7-1.8-6.5 0l-7 7c-1.8 1.8-1.8 4.7 0 6.5l4.5 4.5c1.8 1.8 4.7 1.8 6.5 0l7-7c1.8-1.8 1.8-4.7 0-6.5l-4.5-4.5zM15 10l-5 5M10 15l5-5"/></svg>
                     </ToolButton>
                     <ToolButton onClick={clearCanvas}>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2.5h19v19h-19zM22.5 10.5h-21"/><path d="m15.5 2.5-3 8-3-8"/></svg>
                     </ToolButton>
                 </div>
                 <div className="flex items-center gap-2">
                     <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600">Save</button>
                 </div>
            </div>
            <div ref={containerRef} className="flex-grow bg-white w-full h-full relative">
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
        </div>
    );
};