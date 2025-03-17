
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/utils/toast';
import { Eraser, Download, Upload } from 'lucide-react';

interface SignaturePadProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  initialName?: string;
}

export function SignaturePad({ open, onClose, onSave, initialName = '' }: SignaturePadProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState(initialName);
  const [selectedFont, setSelectedFont] = useState('font-signature');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  
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
    if (open && activeTab === 'draw') {
      setupCanvas();
    }
  }, [open, activeTab]);
  
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
  };
  
  const endPaint = () => {
    setIsPainting(false);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsDrawn(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedSignature(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSave = () => {
    let signatureDataUrl: string | null = null;
    
    if (activeTab === 'draw' && isDrawn) {
      signatureDataUrl = canvasRef.current?.toDataURL() || null;
    } else if (activeTab === 'type' && typedName.trim()) {
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
        signatureDataUrl = tempCanvas.toDataURL();
      }
    } else if (activeTab === 'upload' && uploadedSignature) {
      signatureDataUrl = uploadedSignature;
    }
    
    if (!signatureDataUrl) {
      toast.error('Please create a signature first');
      return;
    }
    
    onSave(signatureDataUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Your Signature</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="mt-4">
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
          </TabsContent>
          
          <TabsContent value="type" className="mt-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Type your name
                </label>
                <Input
                  id="name"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
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
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <div className="grid gap-4">
              <div className="border border-dashed rounded-md p-8 text-center">
                {uploadedSignature ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={uploadedSignature} 
                      alt="Uploaded signature" 
                      className="max-h-32 mb-4" 
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setUploadedSignature(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload an image of your signature
                    </p>
                    <label className="cursor-pointer">
                      <Button variant="outline" type="button">
                        Choose File
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
