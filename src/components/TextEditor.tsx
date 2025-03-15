
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Link as LinkIcon,
  Image
} from 'lucide-react';
import { toast } from '@/utils/toast';

interface TextEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, setContent }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make the editor element editable
    if (editorRef.current) {
      editorRef.current.contentEditable = "true";
      editorRef.current.focus();
      
      // Set initial content if available
      if (content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, []);

  // Update content state when editor content changes
  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Formatting commands
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const imgSrc = event.target?.result as string;
          execCommand('insertHTML', `<img src="${imgSrc}" alt="Uploaded image" style="max-width:100%;" />`);
          toast({
            title: "Image inserted",
            description: "Your image has been added to the document.",
          });
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleLinkInsert = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      const text = document.getSelection()?.toString() || url;
      execCommand('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-350px)]">
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button variant="ghost" size="sm" onClick={() => execCommand('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px bg-border mx-1"></div>
        
        <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<h1>')}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<h2>')}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<h3>')}>
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px bg-border mx-1"></div>
        
        <Button variant="ghost" size="sm" onClick={() => execCommand('justifyLeft')}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('justifyCenter')}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('justifyRight')}>
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <div className="w-px bg-border mx-1"></div>
        
        <Button variant="ghost" size="sm" onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px bg-border mx-1"></div>
        
        <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<blockquote>')}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<pre>')}>
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="w-px bg-border mx-1"></div>
        
        <Button variant="ghost" size="sm" onClick={handleLinkInsert}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleImageUpload}>
          <Image className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        ref={editorRef}
        className="p-6 min-h-[calc(100vh-400px)] focus:outline-none prose prose-sm max-w-none dark:prose-invert"
        onInput={handleInput}
      />
    </div>
  );
};

export default TextEditor;
