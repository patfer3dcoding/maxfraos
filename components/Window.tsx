import React, { useRef, useCallback, useEffect } from 'react';
import type { WindowState, FSNode, FileData } from '../types';
import { WindowControls } from './icons';
import type { Dispatch, SetStateAction } from 'react';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
  onResize: (id: string, pos: { x: number; y: number }, size: { width: number; height: number }) => void;
  isActive: boolean;
  fs: FSNode;
  setFs: Dispatch<SetStateAction<FSNode>>;
  openApp: (appId: string, file?: FileData) => void;
}

const Window: React.FC<WindowProps> = ({ windowState: ws, onClose, onMinimize, onMaximize, onFocus, onDrag, onResize, isActive, fs, setFs, openApp }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ isDragging: false, isResizing: false, resizeHandle: '', initialPos: { x: 0, y: 0 }, initialMouse: { x: 0, y: 0 }, initialSize: { width: 0, height: 0 } });

  const AppContent = ws.component;
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    onFocus(ws.id);
    dragData.current.isDragging = true;
    dragData.current.initialPos = ws.position;
    dragData.current.initialMouse = { x: e.clientX, y: e.clientY };
  }, [onFocus, ws.id, ws.position]);
  
  const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    onFocus(ws.id);
    dragData.current.isResizing = true;
    dragData.current.resizeHandle = handle;
    dragData.current.initialPos = ws.position;
    dragData.current.initialMouse = { x: e.clientX, y: e.clientY };
    dragData.current.initialSize = ws.size;
  }, [onFocus, ws.id, ws.position, ws.size]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { isDragging, isResizing, initialPos, initialMouse, resizeHandle, initialSize } = dragData.current;

    if (isDragging && !ws.isMaximized) {
      const dx = e.clientX - initialMouse.x;
      const dy = e.clientY - initialMouse.y;
      onDrag(ws.id, { x: initialPos.x + dx, y: initialPos.y + dy });
    } else if (isResizing && !ws.isMaximized) {
        let newPos = { ...ws.position };
        let newSize = { ...ws.size };
        const dx = e.clientX - initialMouse.x;
        const dy = e.clientY - initialMouse.y;

        if (resizeHandle.includes('right')) newSize.width = Math.max(300, initialSize.width + dx);
        if (resizeHandle.includes('bottom')) newSize.height = Math.max(200, initialSize.height + dy);
        if (resizeHandle.includes('left')) {
            newSize.width = Math.max(300, initialSize.width - dx);
            newPos.x = initialPos.x + dx;
        }
        if (resizeHandle.includes('top')) {
            newSize.height = Math.max(200, initialSize.height - dy);
            newPos.y = initialPos.y + dy;
        }

        onResize(ws.id, newPos, newSize);
    }
  }, [onDrag, onResize, ws.id, ws.isMaximized, ws.position, ws.size]);

  const handleMouseUp = useCallback(() => {
    dragData.current.isDragging = false;
    dragData.current.isResizing = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  const resizeHandles = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-gray-800 border rounded-lg shadow-2xl transition-all duration-100 ease-in-out ${ws.isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isActive ? 'border-blue-500' : 'border-gray-600'}`}
      style={{
        transform: ws.isMaximized ? 'translate(0, 0)' : `translate(${ws.position.x}px, ${ws.position.y}px)`,
        width: ws.isMaximized ? '100%' : `${ws.size.width}px`,
        height: ws.isMaximized ? 'calc(100% - 48px)' : `${ws.size.height}px`,
        zIndex: ws.zIndex,
        top: ws.isMaximized ? 0 : undefined,
        left: ws.isMaximized ? 0 : undefined,
      }}
      onMouseDown={() => onFocus(ws.id)}
    >
      <header
        className={`flex items-center justify-between pl-3 h-10 select-none ${isActive ? 'bg-gray-700' : 'bg-gray-900'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(ws.id)}
      >
        <div className="flex items-center gap-2">
          {ws.icon('w-5 h-5')}
          <span className="text-white text-sm font-semibold">{ws.title}</span>
        </div>
        <WindowControls
          onMinimize={() => onMinimize(ws.id)}
          onMaximize={() => onMaximize(ws.id)}
          onRestore={() => onMaximize(ws.id)}
          onClose={() => onClose(ws.id)}
          isMaximized={ws.isMaximized}
        />
      </header>
      <main className="flex-grow bg-gray-200 relative overflow-hidden">
        <AppContent 
            fs={fs}
            setFs={setFs}
            openApp={openApp}
            file={ws.file}
            windowId={ws.id}
            closeWindow={() => onClose(ws.id)}
        />
      </main>
      {!ws.isMaximized && resizeHandles.map(handle => (
        <div 
          key={handle}
          className={`absolute ${handle.includes('left') ? 'cursor-ew-resize w-2 left-0' : ''} ${handle.includes('right') ? 'cursor-ew-resize w-2 right-0' : ''} ${handle.includes('top') ? 'cursor-ns-resize h-2 top-0' : ''} ${handle.includes('bottom') ? 'cursor-ns-resize h-2 bottom-0' : ''} ${handle === 'top-left' || handle === 'bottom-right' ? 'cursor-nwse-resize' : ''} ${handle === 'top-right' || handle === 'bottom-left' ? 'cursor-nesw-resize' : ''} ${!handle.includes('-') ? (handle === 'top' || handle === 'bottom' ? 'left-2 right-2' : 'top-2 bottom-2') : 'w-3 h-3'}`}
          onMouseDown={(e) => handleResizeMouseDown(e, handle)}
        />
      ))}
    </div>
  );
};

export default Window;