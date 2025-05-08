
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

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
  const editorRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Listen for custom events to insert fields
  useEffect(() => {
    const handleInsertField = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!editorRef.current || !customEvent.detail) return;
      
      const { fieldText, targetField: eventTargetField } = customEvent.detail;
      
      // Only respond if this editor is the target
      if (eventTargetField !== targetField) return;
      
      editorRef.current.insertContent(fieldText);
    };
    
    document.addEventListener('insert-field', handleInsertField);
    
    return () => {
      document.removeEventListener('insert-field', handleInsertField);
    };
  }, [targetField]);

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <Editor
        apiKey="no-api-key"
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setIsReady(true);
        }}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'formatselect | bold italic underline | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | \
            removeformat | help',
          placeholder: placeholder || 'Digite aqui...',
          content_style: `
            body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size: 14px; }
            [data-mce-placeholder]:before { content: attr(data-mce-placeholder); color: #aaa; }
          `,
          paste_data_images: true,
          setup: (editor) => {
            editor.on('drop', function(e) {
              // Handle drop events for field insertion
              try {
                const dataTransfer = e.dataTransfer;
                if (dataTransfer && dataTransfer.getData('field/json')) {
                  e.preventDefault();
                  const fieldData = JSON.parse(dataTransfer.getData('field/json'));
                  if (fieldData && fieldData.field_key) {
                    editor.insertContent(`{{${fieldData.field_key}}}`);
                  }
                }
              } catch (error) {
                console.error('Error handling drop event:', error);
              }
            });
          },
          formats: {
            field: { inline: 'span', classes: 'template-field', attributes: { 'data-field': '%value' } }
          },
          paste_preprocess: (plugin, args) => {
            // Clean pasted content
          }
        }}
      />
    </div>
  );
}
