
import React, { useState } from 'react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock departments for demonstration
const mockDepartments = [
  "Gabinete do Prefeito",
  "Secretaria de Administração",
  "Secretaria de Educação",
  "Secretaria de Saúde",
  "Secretaria de Assistência Social",
  "Secretaria de Finanças",
  "Departamento de Recursos Humanos",
  "Departamento de Compras",
  "Departamento Jurídico",
  "Departamento de Obras"
];

interface MultipleDestinationsSelectorProps {
  selectedDestinations: string[];
  onChange: (destinations: string[]) => void;
}

export function MultipleDestinationsSelector({ 
  selectedDestinations = [], 
  onChange 
}: MultipleDestinationsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Make sure we have a valid array to work with
  const departments = mockDepartments || [];
  
  const handleSelect = (department: string) => {
    if (selectedDestinations.includes(department)) {
      onChange(selectedDestinations.filter(d => d !== department));
    } else {
      onChange([...selectedDestinations, department]);
    }
  };
  
  const handleRemove = (department: string) => {
    onChange(selectedDestinations.filter(d => d !== department));
  };
  
  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedDestinations.length > 0
              ? `${selectedDestinations.length} departamento${selectedDestinations.length > 1 ? 's' : ''} selecionado${selectedDestinations.length > 1 ? 's' : ''}`
              : "Selecionar departamentos destinatários"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar departamento..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>Nenhum departamento encontrado.</CommandEmpty>
              <CommandGroup>
                {departments.map((department) => (
                  <CommandItem
                    key={department}
                    onSelect={() => handleSelect(department)}
                    className="flex items-center"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDestinations.includes(department) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{department}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedDestinations && selectedDestinations.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedDestinations.map((department) => (
            <Badge key={department} variant="secondary" className="pl-2">
              {department}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 pl-1"
                onClick={() => handleRemove(department)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover {department}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
