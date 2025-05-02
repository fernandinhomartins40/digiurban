
import React from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SchoolCalendarEvent } from "@/services/education/calendar";

// Form schema definition
const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  start_date: z.date({
    required_error: "A data de início é obrigatória",
  }),
  end_date: z.date().optional(),
  event_type: z.enum(['class', 'holiday', 'exam', 'meeting', 'event', 'other']),
  school_id: z.string().optional(),
  school_year: z.number().int().min(2000).max(2100),
  all_day: z.boolean().default(false),
  location: z.string().optional(),
  color: z.string().optional(),
});

type EventFormValues = z.infer<typeof formSchema>;

interface CalendarEventFormProps {
  onSubmit: (data: EventFormValues) => void;
  initialData?: Partial<SchoolCalendarEvent>;
  isEditing?: boolean;
  onCancel: () => void;
}

export function CalendarEventForm({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel
}: CalendarEventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      end_date: initialData?.end_date ? new Date(initialData.end_date) : undefined,
      event_type: initialData?.event_type || 'class',
      school_id: initialData?.school_id || undefined,
      school_year: initialData?.school_year || new Date().getFullYear(),
      all_day: initialData?.all_day ?? false,
      location: initialData?.location || '',
      color: initialData?.color || '',
    },
  });

  function handleSubmit(values: EventFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o evento (opcional)" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de término (opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => (
                        form.getValues('start_date') ? 
                          date < form.getValues('start_date') : false
                      )}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Tipo de evento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="class">Aula</SelectItem>
                    <SelectItem value="holiday">Feriado</SelectItem>
                    <SelectItem value="exam">Avaliação</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="school_year"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Ano letivo</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ano letivo" 
                    min={2000} 
                    max={2100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Local (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Local do evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Cor (opcional)</FormLabel>
                <div className="flex gap-3">
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    className="flex space-x-2"
                  >
                    <FormItem className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value="#4ade80" 
                          className="sr-only peer"
                          id="color-green"
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor="color-green"
                        className="w-6 h-6 bg-green-400 rounded-full cursor-pointer flex items-center justify-center peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-1 peer-data-[state=checked]:ring-black"
                      />
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value="#f87171" 
                          className="sr-only peer"
                          id="color-red"
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor="color-red"
                        className="w-6 h-6 bg-red-400 rounded-full cursor-pointer flex items-center justify-center peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-1 peer-data-[state=checked]:ring-black"
                      />
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value="#60a5fa" 
                          className="sr-only peer"
                          id="color-blue"
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor="color-blue"
                        className="w-6 h-6 bg-blue-400 rounded-full cursor-pointer flex items-center justify-center peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-1 peer-data-[state=checked]:ring-black"
                      />
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value="#a78bfa" 
                          className="sr-only peer"
                          id="color-purple"
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor="color-purple"
                        className="w-6 h-6 bg-purple-400 rounded-full cursor-pointer flex items-center justify-center peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-1 peer-data-[state=checked]:ring-black"
                      />
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value="#fbbf24" 
                          className="sr-only peer"
                          id="color-amber"
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor="color-amber"
                        className="w-6 h-6 bg-amber-400 rounded-full cursor-pointer flex items-center justify-center peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-1 peer-data-[state=checked]:ring-black"
                      />
                    </FormItem>
                    
                    <FormItem className="flex items-center space-x-0 space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value="#94a3b8" 
                          className="sr-only peer"
                          id="color-slate"
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor="color-slate"
                        className="w-6 h-6 bg-slate-400 rounded-full cursor-pointer flex items-center justify-center peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-1 peer-data-[state=checked]:ring-black"
                      />
                    </FormItem>
                  </RadioGroup>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="all_day"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Dia inteiro</FormLabel>
                <FormDescription>
                  Marque esta opção se o evento durar o dia todo.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Atualizar evento" : "Criar evento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
