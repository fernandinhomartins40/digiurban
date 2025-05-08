
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
  targetField?: 'content' | 'header' | 'footer';
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  error,
  className,
  onDrop,
  targetField = 'content',
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
        
        // Check if this is our custom field drag
        const fieldData = event.dataTransfer?.getData('field/json');
        if (fieldData) {
          try {
            const field = JSON.parse(fieldData);
            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            
            if (coordinates) {
              const transaction = view.state.tr.insertText(`{{${field.field_key}}}`, coordinates.pos);
              view.dispatch(transaction);
              return true;
            }
          } catch (error) {
            console.error('Error processing dropped field:', error);
          }
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
        const eventTargetField = e.detail?.targetField;
        
        // Only insert if this is the right editor for the target field
        if (fieldKey && (!eventTargetField || eventTargetField === targetField)) {
          editor.commands.insertContent(`{{${fieldKey}}}`);
        }
      }
    };

    document.addEventListener('insert-field', handleInsertField as EventListener);
    return () => {
      document.removeEventListener('insert-field', handleInsertField as EventListener);
    };
  }, [editor, targetField]);

  // Handle selection conversion to field
  useEffect(() => {
    const handleCreateFieldFromSelection = (e: CustomEvent) => {
      if (editor && e.detail?.targetField === targetField) {
        const selection = editor.state.selection;
        if (!selection.empty) {
          const selectedText = editor.state.doc.textBetween(
            selection.from,
            selection.to,
            ' '
          );
          
          if (selectedText) {
            const fieldKey = e.detail?.fieldKey || selectedText.replace(/\s+/g, '_').toLowerCase();
            editor.chain().deleteSelection().insertContent(`{{${fieldKey}}}`).run();
            
            // Return the created field info so parent components can add it to fields list
            if (e.detail?.callback) {
              e.detail.callback({
                field_key: fieldKey,
                field_label: selectedText,
                field_type: 'text'
              });
            }
          }
        }
      }
    };

    document.addEventListener('create-field-from-selection', handleCreateFieldFromSelection as EventListener);
    return () => {
      document.removeEventListener('create-field-from-selection', handleCreateFieldFromSelection as EventListener);
    };
  }, [editor, targetField]);

  return (
    <div 
      className={cn('border rounded-lg overflow-hidden', 
        error && 'border-destructive', 
        className
      )}
    >
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}
