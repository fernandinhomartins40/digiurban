
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  ListOrdered, 
  ListUnordered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Underline
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function WysiwygEditor({ 
  value, 
  onChange, 
  placeholder = 'Digite o conteúdo...', 
  className,
  error
}: WysiwygEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update the editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!isMounted) {
    return null;
  }

  const handleInsertField = (fieldKey: string) => {
    if (!editor) return;
    
    const fieldPlaceholder = `{{${fieldKey}}}`;
    
    // Insert the field placeholder at the current cursor position
    editor
      .chain()
      .focus()
      .insertContent(fieldPlaceholder)
      .run();
  };

  return (
    <div className={cn(
      "border rounded-md overflow-hidden bg-background",
      error ? "border-destructive" : "border-input",
      className
    )}>
      <div className="border-b p-2 bg-muted flex flex-wrap gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={cn(editor?.isActive('bold') ? 'bg-accent' : '')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={cn(editor?.isActive('italic') ? 'bg-accent' : '')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={cn(editor?.isActive('underline') ? 'bg-accent' : '')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="border-l mx-1 h-6"></div>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={cn(editor?.isActive('bulletList') ? 'bg-accent' : '')}
        >
          <ListUnordered className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={cn(editor?.isActive('orderedList') ? 'bg-accent' : '')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="border-l mx-1 h-6"></div>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          className={cn(editor?.isActive({ textAlign: 'left' }) ? 'bg-accent' : '')}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          className={cn(editor?.isActive({ textAlign: 'center' }) ? 'bg-accent' : '')}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          className={cn(editor?.isActive({ textAlign: 'right' }) ? 'bg-accent' : '')}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="p-3 min-h-[200px] prose prose-sm max-w-none" 
      />
    </div>
  );
}
