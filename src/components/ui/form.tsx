
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// Create a safe version of useFormContext that doesn't throw
const useSafeFormContext = () => {
  const context = useFormContext();
  return context;
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const formContext = useSafeFormContext()

  if (!formContext) {
    throw new Error("useFormField must be used within a Form component")
  }

  const { getFieldState, formState } = formContext

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...getFieldState(fieldContext.name, formState),
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// Create a standalone version of FormLabel that doesn't require FormContext
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const formContext = useSafeFormContext();
  
  // If we're in a form context, use the field data
  if (formContext) {
    try {
      const { error, formItemId } = useFormField();
      return (
        <Label
          ref={ref}
          className={cn(error && "text-destructive", className)}
          htmlFor={formItemId}
          {...props}
        />
      );
    } catch (e) {
      // If useFormField fails, fall back to standalone label
      return <Label ref={ref} className={className} {...props} />;
    }
  }
  
  // Standalone mode
  return <Label ref={ref} className={className} {...props} />;
})
FormLabel.displayName = "FormLabel"

// Create a standalone version of FormControl
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const formContext = useSafeFormContext();
  
  // If we're in a form context, use the field data
  if (formContext) {
    try {
      const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
      return (
        <Slot
          ref={ref}
          id={formItemId}
          aria-describedby={
            !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          {...props}
        />
      );
    } catch (e) {
      // If useFormField fails, render without context-specific props
      return <Slot ref={ref} {...props} />;
    }
  }
  
  // Standalone mode
  return <Slot ref={ref} {...props} />;
})
FormControl.displayName = "FormControl"

// Create a standalone version of FormDescription
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const formContext = useSafeFormContext();
  
  // If we're in a form context, use the field data
  if (formContext) {
    try {
      const { formDescriptionId } = useFormField();
      return (
        <p
          ref={ref}
          id={formDescriptionId}
          className={cn("text-sm text-muted-foreground", className)}
          {...props}
        />
      );
    } catch (e) {
      // If useFormField fails, render without id
      return (
        <p
          ref={ref}
          className={cn("text-sm text-muted-foreground", className)}
          {...props}
        />
      );
    }
  }
  
  // Standalone mode
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
})
FormDescription.displayName = "FormDescription"

// Create a standalone version of FormMessage
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const formContext = useSafeFormContext();
  
  // If we're in a form context, use the field data
  if (formContext) {
    try {
      const { error, formMessageId } = useFormField();
      const body = error ? String(error?.message) : children;
      
      if (!body) {
        return null;
      }
      
      return (
        <p
          ref={ref}
          id={formMessageId}
          className={cn("text-sm font-medium text-destructive", className)}
          {...props}
        >
          {body}
        </p>
      );
    } catch (e) {
      // If useFormField fails but we have children, render them
      if (!children) {
        return null;
      }
      
      return (
        <p
          ref={ref}
          className={cn("text-sm font-medium text-destructive", className)}
          {...props}
        >
          {children}
        </p>
      );
    }
  }
  
  // Standalone mode
  if (!children) {
    return null;
  }
  
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
