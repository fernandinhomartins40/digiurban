
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TagsListProps {
  tags?: string[];
}

export function TagsList({ tags }: TagsListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="p-2 flex flex-wrap gap-1 border-b">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
