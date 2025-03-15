
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, FileText, Download, Share2 } from 'lucide-react';
import TextEditor from '@/components/TextEditor';
import { toast } from '@/utils/toast';

const DocumentEditor = () => {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

  const handleSave = () => {
    // In a real app, this would save to Supabase
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully.",
    });
  };

  const handleDownload = () => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded successfully.",
    });
  };

  const handleShare = () => {
    // In a real app, this would create a sharing link
    toast({
      title: "Share link created",
      description: "A sharing link has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <FileText className="text-primary" />
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                placeholder="Document Title"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
          
          <Card className="p-0 min-h-[calc(100vh-250px)]">
            <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="edit" className="p-0 m-0">
                <TextEditor 
                  content={content} 
                  setContent={setContent} 
                />
              </TabsContent>
              
              <TabsContent value="preview" className="p-6 m-0">
                {content ? (
                  <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <p>No content to preview yet.</p>
                    <p className="text-sm">Start editing to see a preview here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentEditor;
