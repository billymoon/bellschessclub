"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  containerClassName?: string;
}

const FormFieldSelect = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { label, error, description, required, containerClassName, id, children },
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
              "text-sm font-medium leading-none pt-4",
              error && "text-destructive",
              required &&
                "after:content-['*'] after:ml-0.5 after:text-destructive",
            )}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground absolute right-2 h-9" />
          {children}
        </div>

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

FormFieldSelect.displayName = "FormFieldSelect";

export { FormFieldSelect };
