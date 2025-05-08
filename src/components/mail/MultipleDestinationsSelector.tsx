
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Common departments in a Brazilian municipality
const commonDepartments = [
  "Administração",
  "Assistência Social",
  "Comunicação",
  "Cultura",
  "Educação",
  "Esportes",
  "Fazenda",
  "Gabinete do Prefeito",
  "Infraestrutura",
  "Jurídico",
  "Meio Ambiente",
  "Obras",
  "Planejamento",
  "Recursos Humanos",
  "Saúde",
  "Segurança",
  "Serviços Urbanos",
  "Transporte",
  "Turismo",
  "Urbanismo",
];

interface MultipleDestinationsSelectorProps {
  selectedDestinations: string[];
  onChange: (value: string[]) => void;
}

export function MultipleDestinationsSelector({
  selectedDestinations,
  onChange,
}: MultipleDestinationsSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Add a new destination that's not in the common list
  const addCustomDestination = () => {
    if (!query.trim()) return;
    
    if (!selectedDestinations.includes(query)) {
      onChange([...selectedDestinations, query]);
    }
    
    setQuery("");
  };

  // Remove a destination
  const removeDestination = (destination: string) => {
    onChange(selectedDestinations.filter((d) => d !== destination));
  };

  // Toggle a destination selection
  const toggleDestination = (destination: string) => {
    if (selectedDestinations.includes(destination)) {
      removeDestination(destination);
    } else {
      onChange([...selectedDestinations, destination]);
    }
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
              ? `${selectedDestinations.length} departamento(s) selecionado(s)`
              : "Selecione departamentos..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar departamento..." 
              value={query}
              onValueChange={setQuery}
            />
            <CommandEmpty>
              <div className="flex flex-col gap-2 p-2">
                <span>Nenhum departamento encontrado.</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addCustomDestination}
                >
                  Adicionar "{query}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {commonDepartments.map((department) => (
                <CommandItem
                  key={department}
                  onSelect={() => toggleDestination(department)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDestinations.includes(department) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {department}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedDestinations.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedDestinations.map((destination) => (
            <Badge key={destination} variant="secondary">
              {destination}
              <X
                className="ml-2 h-3 w-3 cursor-pointer"
                onClick={() => removeDestination(destination)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
