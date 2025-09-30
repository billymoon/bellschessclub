"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      description,
      required,
      className,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const fieldId = React.useId();
    const descriptionId = `${fieldId}-description`;
    const errorId = `${fieldId}-error`;

    return (
      <div className={cn("grid gap-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={id || fieldId}
            className={cn(
              "text-sm font-medium leading-none",
              error && "text-destructive",
              required &&
                "after:content-['*'] after:ml-0.5 after:text-destructive",
            )}
          >
            {label}
          </Label>
        )}

        <Input
          ref={ref}
          id={id || fieldId}
          className={cn(
            error && "border-destructive focus-visible:border-destructive",
            className,
          )}
          aria-describedby={cn(description && descriptionId, error && errorId)}
          aria-invalid={!!error}
          {...props}
        />

        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export { FormField };
