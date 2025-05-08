
import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { cn } from '@/lib/utils';
import { EditorToolbar } from './EditorToolbar';

interface WysiwygEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  targetField?: 'content' | 'header' | 'footer';
  height?: number;
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder,
  className,
  targetField = 'content',
  height = 400,
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Setup TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Digite aqui...',
      }),
      TextStyle,
      Color,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Listen for custom events to insert fields
  useEffect(() => {
    const handleInsertField = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!editor || !customEvent.detail) return;
      
      const { fieldText, targetField: eventTargetField } = customEvent.detail;
      
      // Only respond if this editor is the target
      if (eventTargetField !== targetField) return;
      
      editor.commands.insertContent(fieldText);
    };
    
    document.addEventListener('insert-field', handleInsertField);
    
    return () => {
      document.removeEventListener('insert-field', handleInsertField);
    };
  }, [editor, targetField]);

  // Handle drop events for field insertion
  useEffect(() => {
    if (!editorRef.current || !editor) return;

    const handleDrop = (e: DragEvent) => {
      try {
        const dataTransfer = e.dataTransfer;
        if (dataTransfer && dataTransfer.getData('field/json')) {
          e.preventDefault();
          const fieldData = JSON.parse(dataTransfer.getData('field/json'));
          if (fieldData && fieldData.field_key) {
            editor.commands.insertContent(`{{${fieldData.field_key}}}`);
          }
        }
      } catch (error) {
        console.error('Error handling drop event:', error);
      }
    };

    const editorElement = editorRef.current;
    editorElement.addEventListener('drop', handleDrop);

    return () => {
      editorElement.removeEventListener('drop', handleDrop);
    };
  }, [editor]);

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      {editor && <EditorToolbar editor={editor} targetField={targetField} />}
      <div 
        ref={editorRef} 
        className="editor-content" 
        style={{ height: `${height - 40}px`, overflowY: 'auto', padding: '1rem' }}
      >
        <EditorContent editor={editor} className="prose max-w-none focus:outline-none" />
      </div>
    </div>
  );
}
