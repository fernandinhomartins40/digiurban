
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Heading } from '@tiptap/extension-heading';
import { cn } from '@/lib/utils';
import { FontSize } from '@/components/mail/editor-extensions/font-size';
import { FontFamily } from '@/components/mail/editor-extensions/font-family';
import { EditorToolbar } from '@/components/mail/EditorToolbar';
import { useEffect } from 'react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  onDrop?: (e: DragEvent) => void;
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  error,
  className,
  onDrop,
}: WysiwygEditorProps) {
  // Define the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
      TextStyle,
      Color,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      FontSize,
      FontFamily,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (onDrop) {
          onDrop(event);
          return true;
        }
        return false;
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Handle insertion of fields when event is fired
  useEffect(() => {
    const handleInsertField = (e: CustomEvent) => {
      if (editor) {
        const fieldKey = e.detail?.fieldKey;
        if (fieldKey) {
          editor.commands.insertContent(`{{${fieldKey}}}`);
        }
      }
    };

    document.addEventListener('insert-field', handleInsertField as EventListener);
    return () => {
      document.removeEventListener('insert-field', handleInsertField as EventListener);
    };
  }, [editor]);

  return (
    <div className={cn('border rounded-lg overflow-hidden', error && 'border-destructive', className)}>
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}
