
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/utils/toast';
import { Eraser, Download, Upload, Check, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SignaturePadProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  initialName?: string;
}

export function SignaturePad({ open, onClose, onSave, initialName = '' }: SignaturePadProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload' | 'saved'>('draw');
  const [typedName, setTypedName] = useState(initialName);
  const [selectedFont, setSelectedFont] = useState('font-signature');
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState<Array<{ id: string, signature_data: string, name: string | null }>>([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  
  // Check if user is authenticated and load their saved signatures
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedIn = !!session;
      setIsAuthenticated(isLoggedIn);
      
      if (isLoggedIn && open) {
        loadSavedSignatures();
      }
    };
    
    if (open) {
      checkAuth();
    }
  }, [open]);
  
  const loadSavedSignatures = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSavedSignatures(data || []);
      
      // Set the default signature as selected if it exists
      const defaultSignature = data?.find(sig => sig.is_default);
      if (defaultSignature) {
        setSelectedSignatureId(defaultSignature.id);
      }
    } catch (error) {
      console.error('Error loading signatures:', error);
      toast.error('Failed to load saved signatures');
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const saveSignatureToDatabase = async (signatureDataUrl: string) => {
    try {
      setIsLoading(true);
      
      // If isDefault is true, we need to update all other signatures to not be default
      if (isDefault) {
        await supabase
          .from('signatures')
          .update({ is_default: false })
          .not('id', 'is', null);
      }
      
      const { data, error } = await supabase
        .from('signatures')
        .insert([
          { 
            signature_data: signatureDataUrl, 
            name: signatureName || typedName || null,
            is_default: isDefault
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Signature saved to your account');
      
      // Refresh the saved signatures list
      loadSavedSignatures();
      
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Failed to save signature to your account');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    let signatureDataUrl: string | null = null;
    
    // If the saved signatures tab is active and a signature is selected
    if (activeTab === 'saved' && selectedSignatureId) {
      const selectedSignature = savedSignatures.find(sig => sig.id === selectedSignatureId);
      if (selectedSignature) {
        signatureDataUrl = selectedSignature.signature_data;
      }
    } else if (activeTab === 'draw' && isDrawn) {
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
    
    // Save to database if the user is authenticated and has checked the save option
    if (isAuthenticated && saveToAccount && activeTab !== 'saved') {
      await saveSignatureToDatabase(signatureDataUrl);
    }
    
    onSave(signatureDataUrl);
    onClose();
  };
  
  const setSignatureAsDefault = async (signatureId: string) => {
    try {
      setIsLoading(true);
      
      // First set all signatures to not default
      await supabase
        .from('signatures')
        .update({ is_default: false })
        .not('id', 'is', null);
      
      // Then set the selected one as default
      const { error } = await supabase
        .from('signatures')
        .update({ is_default: true })
        .eq('id', signatureId);
      
      if (error) throw error;
      
      toast.success('Default signature updated');
      loadSavedSignatures();
      
    } catch (error) {
      console.error('Error updating default signature:', error);
      toast.error('Failed to update default signature');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSignature = async (signatureId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', signatureId);
      
      if (error) throw error;
      
      toast.success('Signature deleted');
      
      if (selectedSignatureId === signatureId) {
        setSelectedSignatureId(null);
      }
      
      loadSavedSignatures();
      
    } catch (error) {
      console.error('Error deleting signature:', error);
      toast.error('Failed to delete signature');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Your Signature</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="saved">Saved</TabsTrigger>
            )}
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
            
            {isAuthenticated && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="save-signature" 
                    checked={saveToAccount}
                    onCheckedChange={(checked) => setSaveToAccount(checked as boolean)}
                  />
                  <label htmlFor="save-signature" className="text-sm cursor-pointer">
                    Save this signature to my account
                  </label>
                </div>
                
                {saveToAccount && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Signature name (optional)"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="text-sm"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="default-signature" 
                        checked={isDefault}
                        onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                      />
                      <label htmlFor="default-signature" className="text-sm cursor-pointer">
                        Set as default signature
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
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
              
              {isAuthenticated && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="save-typed-signature" 
                      checked={saveToAccount}
                      onCheckedChange={(checked) => setSaveToAccount(checked as boolean)}
                    />
                    <label htmlFor="save-typed-signature" className="text-sm cursor-pointer">
                      Save this signature to my account
                    </label>
                  </div>
                  
                  {saveToAccount && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Signature name (optional)"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        className="text-sm"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="default-typed-signature" 
                          checked={isDefault}
                          onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                        />
                        <label htmlFor="default-typed-signature" className="text-sm cursor-pointer">
                          Set as default signature
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              
              {isAuthenticated && uploadedSignature && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="save-uploaded-signature" 
                      checked={saveToAccount}
                      onCheckedChange={(checked) => setSaveToAccount(checked as boolean)}
                    />
                    <label htmlFor="save-uploaded-signature" className="text-sm cursor-pointer">
                      Save this signature to my account
                    </label>
                  </div>
                  
                  {saveToAccount && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Signature name (optional)"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        className="text-sm"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="default-uploaded-signature" 
                          checked={isDefault}
                          onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                        />
                        <label htmlFor="default-uploaded-signature" className="text-sm cursor-pointer">
                          Set as default signature
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {isAuthenticated && (
            <TabsContent value="saved" className="mt-4">
              <div className="grid gap-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : savedSignatures.length > 0 ? (
                  <div className="grid gap-3">
                    {savedSignatures.map((signature) => (
                      <div 
                        key={signature.id} 
                        className={`border rounded-md p-3 cursor-pointer transition-all ${
                          selectedSignatureId === signature.id ? 'border-primary ring-1 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedSignatureId(signature.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {signature.name || 'Unnamed Signature'}
                            </span>
                            {signature.is_default && (
                              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {!signature.is_default && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSignatureAsDefault(signature.id);
                                }}
                                title="Set as default"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSignature(signature.id);
                              }}
                              title="Delete signature"
                            >
                              <Eraser className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <img 
                            src={signature.signature_data} 
                            alt={signature.name || 'Signature'} 
                            className="max-h-12 mx-auto"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don't have any saved signatures yet.</p>
                    <p className="text-sm mt-1">Create and save a signature using the other tabs.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              'Save Signature'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
