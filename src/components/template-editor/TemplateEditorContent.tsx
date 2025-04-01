
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextEditor from '@/components/TextEditor';

interface TemplateEditorContentProps {
  content: string;
  setContent: (content: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TemplateEditorContent: React.FC<TemplateEditorContentProps> = ({
  content,
  setContent,
  activeTab,
  setActiveTab
}) => {
  return (
    <Card className="p-0 min-h-[calc(100vh-250px)]">
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
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
  );
};

export default TemplateEditorContent;
