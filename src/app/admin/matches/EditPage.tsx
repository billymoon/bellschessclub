"use client";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Match, MatchPartial } from "@/modules/schema";
import { useForm } from "react-hook-form";
import { create } from "superstruct";
import { FormFieldSelect } from "@/components/FormFieldSelect";
import { cn } from "@/lib/utils";
import { createMatchDocument, updateMatchDocument } from "@/modules/turso";
import { ComboboxBasic } from "@/components/ComboboxBasic";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HOME_VENUE_NAME = "Edinburgh West End Bowling Club";

const localDate = (dateIn: number | string | Date) => {
  const [dd, MM, yyyy, hh, mm] = new Date(dateIn)
    .toLocaleString("en-GB")
    .split(/\D+/g);
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

export const EditPage = ({
  venueNames,
  opponentNames,
  currentDocument = null,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm({
    defaultValues: currentDocument
      ? {
          ...currentDocument,
          date: localDate(currentDocument.date),
        }
      : {
          team: 1,
          isAtHome: true,
          venue: HOME_VENUE_NAME,
          date: localDate(new Date().setHours(19, 0, 0, 0)),
        },
    resolver: async (schema: Match) => {
      const errors = {};
      console.log({ schema });
      try {
        const values = create(
          {
            ...schema,
            isAtHome: schema.venue === HOME_VENUE_NAME,
            date: new Date(schema.date).toISOString(),
          },
          Match,
        );
        return {
          errors,
          values,
        };
      } catch (err) {
        return {
          errors: {
            [err.key]: err.message,
          },
        };
      }
    },
  });

  const onSubmit = async (values: MatchPartial) => {
    setIsSubmitting(true)
    if (currentDocument) {
      await updateMatchDocument(values);
    } else {
      await createMatchDocument(values);
    }
    router.push("/private/matches");
  };

  const registerWithErrors = (fieldName) => ({
    ...register(fieldName),
    defaultValue: defaultValues[fieldName],
    error: errors[fieldName]?.toString(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFieldSelect label="Team">
          <select
            {...registerWithErrors("team")}
            className={cn(
              "placeholder:text-muted-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border appearance-none",
              "bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            )}
          >
            <option value="0">Summercup</option>
            <option value="1">Team 1</option>
            <option value="2">Team 2</option>
          </select>
        </FormFieldSelect>

        <FormField
          {...registerWithErrors("date")}
          label="Date"
          type="datetime-local"
        />
        <FormFieldWrapper
          as={ComboboxBasic}
          items={opponentNames}
          setValue={setValue}
          label="Opponent"
          {...registerWithErrors("opponent")}
        />
        {/* <FormField {...registerWithErrors("opponent")} label="Opponent" /> */}
        {/* <FormField {...registerWithErrors("venue")} label="Venue" /> */}
        <FormFieldWrapper
          as={ComboboxBasic}
          items={venueNames}
          setValue={setValue}
          label="Venue"
          {...registerWithErrors("venue")}
        />
        <FormField {...registerWithErrors("mapLink")} label="Map" />
        <Button type="submit" className="mt-4 cursor-pointer" disabled={isSubmitting}>
          Save
        </Button>
      </form>
    </div>
  );
};
