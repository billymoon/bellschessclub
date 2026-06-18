"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.ComponentProps<"input"> {
  as?: React.Component;
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
}

export const FormFieldWrapper = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      as,
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
    const Component = as || Input
    const fieldId = React.useId();
    const descriptionId = `${fieldId}-description`;
    const errorId = `${fieldId}-error`;

    return (
      <div className={cn("grid gap-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={id || fieldId}
            className={cn(
              "text-sm font-medium leading-none pt-4",
              error && "text-destructive",
              required &&
                "after:content-['*'] after:ml-0.5 after:text-destructive",
            )}
          >
            {label}
          </Label>
        )}

        <Component
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

FormFieldWrapper.displayName = "FormFieldWrapper";
