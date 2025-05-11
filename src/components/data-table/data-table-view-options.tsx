
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { type Table } from "@tanstack/react-table";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData> | null;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Additional controls can go here */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Visualização
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Opções de visualização</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table && (
            <>
              {table.getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize"
                      onClick={() => column.toggleVisibility(!column.getIsVisible())}
                    >
                      <div
                        className={`mr-2 h-4 w-4 rounded-sm border border-primary ${
                          column.getIsVisible() ? "bg-primary" : "opacity-50"
                        }`}
                      />
                      {column.id}
                    </DropdownMenuItem>
                  );
                })}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
