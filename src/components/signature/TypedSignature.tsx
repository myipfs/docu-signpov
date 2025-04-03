
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface TypedSignatureProps {
  initialName: string;
  onDataUrlChange: (dataUrl: string | null) => void;
  onNameChange: (name: string) => void;
}

export function TypedSignature({ initialName, onDataUrlChange, onNameChange }: TypedSignatureProps) {
  const [typedName, setTypedName] = useState(initialName);
  const [selectedFont, setSelectedFont] = useState('font-signature');
  
  useEffect(() => {
    if (typedName.trim()) {
      generateTypedSignature();
    } else {
      onDataUrlChange(null);
    }
  }, [typedName, selectedFont]);
  
  const generateTypedSignature = () => {
    if (!typedName.trim()) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 300;
    tempCanvas.height = 150;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.fillStyle = '#000';
      ctx.font = `48px ${selectedFont === 'font-signature' ? 'cursive' : 'sans-serif'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName, 150, 75);
      onDataUrlChange(tempCanvas.toDataURL());
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTypedName(newName);
    onNameChange(newName);
  };

  return (
    <div className="grid gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Type your name
        </label>
        <Input
          id="name"
          value={typedName}
          onChange={handleNameChange}
          placeholder="Your name"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Choose style</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            type="button" 
            className={`border rounded-md p-3 text-center hover:border-primary transition-colors ${
              selectedFont === 'font-signature' ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedFont('font-signature')}
          >
            <span className="font-serif text-xl">Signature</span>
          </button>
          <button
            type="button"
            className={`border rounded-md p-3 text-center hover:border-primary transition-colors ${
              selectedFont === 'font-sans' ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedFont('font-sans')}
          >
            <span className="font-sans text-xl">Signature</span>
          </button>
        </div>
      </div>
      
      <div className="border rounded-md bg-white p-8 flex items-center justify-center h-24">
        {typedName ? (
          <div className={`text-3xl ${selectedFont === 'font-signature' ? 'font-serif' : 'font-sans'}`}>
            {typedName}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Type your name above to preview
          </div>
        )}
      </div>
    </div>
  );
}
