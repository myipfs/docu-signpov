
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

interface SignatureCanvasProps {
  onDataUrlChange: (dataUrl: string | null) => void;
}

export function SignatureCanvas({ onDataUrlChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  useEffect(() => {
    setupCanvas();
  }, []);
  
  const startPaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsPainting(true);
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  
  const paint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setIsDrawn(true);
    
    if (isDrawn) {
      onDataUrlChange(canvas.toDataURL());
    }
  };
  
  const endPaint = () => {
    if (isPainting) {
      setIsPainting(false);
      const canvas = canvasRef.current;
      if (canvas && isDrawn) {
        onDataUrlChange(canvas.toDataURL());
      }
    }
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsDrawn(false);
    onDataUrlChange(null);
  };

  return (
    <div className="border rounded-md bg-white">
      <canvas
        ref={canvasRef}
        width={450}
        height={200}
        className="w-full h-48 border-b cursor-crosshair touch-none"
        onMouseDown={startPaint}
        onMouseMove={paint}
        onMouseUp={endPaint}
        onMouseLeave={endPaint}
      ></canvas>
      <div className="flex justify-end p-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearCanvas} 
          className="gap-2"
        >
          <Eraser size={14} />
          Clear
        </Button>
      </div>
    </div>
  );
}
