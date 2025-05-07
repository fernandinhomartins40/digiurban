
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MagicWandIcon } from "lucide-react";
import { TemplateField } from "@/types/mail";

interface AutoPopulateFieldsProps {
  fields: TemplateField[];
  content: string;
  onPopulate: (content: string) => void;
}

export function AutoPopulateFields({ fields, content, onPopulate }: AutoPopulateFieldsProps) {
  // Function to insert fields at logical positions in the document
  const handlePopulate = () => {
    let newContent = content;
    
    // Check for missing fields in the content
    fields.forEach(field => {
      const placeholder = `{{${field.field_key}}}`;
      
      // If placeholder not in content, add it at a logical position
      if (!newContent.includes(placeholder)) {
        // For specific field types, insert at logical positions
        if (field.field_key === 'corpo_texto') {
          // Find a paragraph to place the body text
          const paragraphMatch = /<p><br><\/p>/;
          if (paragraphMatch.test(newContent)) {
            newContent = newContent.replace(
              paragraphMatch, 
              `<p><br></p><p>${placeholder}</p><p><br></p>`
            );
          } else {
            // Append to the end if no suitable position found
            newContent += `<p>${placeholder}</p>`;
          }
        } else if (field.field_key === 'data_emissao') {
          // Try to find a right-aligned paragraph for the date
          if (!newContent.includes(placeholder)) {
            const rightAlignMatch = /<p style="text-align:right;">/;
            if (rightAlignMatch.test(newContent)) {
              newContent = newContent.replace(
                rightAlignMatch,
                `<p style="text-align:right;">${placeholder}, `
              );
            } else {
              // Add at the top if no suitable position
              newContent = `<p style="text-align:right;">${placeholder}</p>` + newContent;
            }
          }
        } else if (field.field_key.startsWith('destinatario_')) {
          // Try to find the destinatary section
          if (!newContent.includes('A Sua Excelência')) {
            newContent += `<p><strong>A Sua Excelência o(a) Senhor(a)</strong></p>
<p><strong>${placeholder}</strong></p>`;
          }
        } else if (field.field_key.startsWith('remetente_')) {
          // Try to find the closing section
          if (!newContent.includes('Atenciosamente')) {
            newContent += `<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>${placeholder}</strong></p>`;
          }
        } else {
          // Append other fields at the end if they can't be placed logically
          newContent += `<p>${field.field_label}: ${placeholder}</p>`;
        }
      }
    });
    
    onPopulate(newContent);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            onClick={handlePopulate}
            className="gap-2"
          >
            <MagicWandIcon className="h-4 w-4" />
            <span>Inserir Campos</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preencher automaticamente o documento com os campos do modelo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
