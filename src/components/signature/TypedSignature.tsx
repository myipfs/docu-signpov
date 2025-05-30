
import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface TypedSignatureProps {
  initialName: string;
  onDataUrlChange: (dataUrl: string | null) => void;
  onNameChange: (name: string) => void;
}

export function TypedSignature({ initialName, onDataUrlChange, onNameChange }: TypedSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedName, setTypedName] = React.useState(initialName);

  const generateSignature = (name: string) => {
    if (!canvasRef.current || !name.trim()) {
      onDataUrlChange(null);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Increase canvas size to accommodate longer names
    canvas.width = Math.max(400, name.length * 25);
    canvas.height = 120;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up the text style
    ctx.font = '32px Dancing Script, cursive';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the name in the center
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    onDataUrlChange(dataUrl);
  };

  useEffect(() => {
    generateSignature(typedName);
  }, [typedName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTypedName(newName);
    onNameChange(newName);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Type your name
        </label>
        <Input
          id="name"
          type="text"
          value={typedName}
          onChange={handleNameChange}
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>
      
      <div className="border rounded-md p-6 bg-white min-h-[120px] flex items-center justify-center">
        {typedName ? (
          <canvas
            ref={canvasRef}
            className="max-w-full"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          />
        ) : (
          <p className="text-muted-foreground text-sm">Your signature will appear here</p>
        )}
      </div>
    </div>
  );
}
