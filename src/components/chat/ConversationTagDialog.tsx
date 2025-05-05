
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ConversationTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTag: (tag: string) => void;
}

export function ConversationTagDialog({
  open,
  onOpenChange,
  onAddTag,
}: ConversationTagDialogProps) {
  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
      onOpenChange(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <span className="hidden" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Adicionar tag</h4>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nome da tag"
              className="text-sm"
            />
            <Button size="sm" onClick={handleAddTag}>
              <Tag size={16} />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
