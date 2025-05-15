
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path?: string;
  children?: {
    title: string;
    path: string;
    badge?: number;
  }[];
  moduleId?: string;
  badge?: number;
}

export const SidebarItem = ({ icon, title, path, children, moduleId, badge }: SidebarItemProps) => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;
  
  // Check for active state: either direct path match or one of children paths match
  const isActive = path 
    ? location.pathname === path 
    : children?.some(child => location.pathname === child.path);
  
  // Auto-expand menu when any child is active
  useEffect(() => {
    if (children?.some(child => location.pathname === child.path)) {
      setIsOpen(true);
    }
  }, [location.pathname, children]);

  // Check if user has permission to see this module
  if (moduleId && !hasPermission(moduleId, "read")) {
    return null;
  }

  // Debug logs to help diagnose issues
  console.log(`Rendering sidebar item: ${title}, Path: ${path}, Active: ${isActive}`);
  if (hasChildren) {
    console.log(`Children paths for ${title}:`, children.map(c => c.path).join(', '));
  }

  return (
    <div className="w-full">
      {hasChildren ? (
        <div className="w-full">
          <button
            className={cn(
              "flex items-center w-full px-4 py-2 text-sm rounded-md",
              isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => setIsOpen(!isOpen)}
            data-testid={`sidebar-item-${title}`}
          >
            <span className="mr-2">{icon}</span>
            <span className="flex-1 text-left">{title}</span>
            {badge > 0 && (
              <Badge className="mr-2 bg-primary">{badge}</Badge>
            )}
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isOpen && (
            <div className="pl-6 mt-1 space-y-1">
              {children.map((child, index) => (
                <Link
                  key={index}
                  to={child.path}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-sm rounded-md",
                    location.pathname === child.path
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  data-testid={`sidebar-child-${child.title}`}
                >
                  <span className="flex-1">{child.title}</span>
                  {child.badge && child.badge > 0 && (
                    <Badge className="bg-primary">{child.badge}</Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          to={path || "#"}
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm rounded-md",
            isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
          )}
          data-testid={`sidebar-link-${title}`}
        >
          <span className="mr-2">{icon}</span>
          <span className="flex-1">{title}</span>
          {badge > 0 && (
            <Badge className="bg-primary">{badge}</Badge>
          )}
        </Link>
      )}
    </div>
  );
};
