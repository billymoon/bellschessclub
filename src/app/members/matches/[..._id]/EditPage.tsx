"use client";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { updateDocumentById } from "@/modules/sanity";
import { Match, MatchPartial, MatchStringified } from "@/modules/schema";
import { useForm } from "react-hook-form";
import { create } from "superstruct";

export const EditPage = ({ matchDocument }: { matchDocument: Match }) => {
  console.log(matchDocument)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...create(matchDocument, MatchStringified),
    },
    resolver: (schema, _, args) => {
      console.log(schema, _, args);
      const errors = {};
      try {
        const values = create(schema, Match);
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

  const onSubmit = async (formValues: MatchPartial) => {
    const values = create(formValues, MatchPartial);
    await updateDocumentById(formValues._id, {
      ...values,
    });
    window.location.replace(window.location.href);
  };

  const registerWithErrors = (fieldName) => ({
    ...register(fieldName),
    error: errors[fieldName]?.toString(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          {...registerWithErrors("date")}
          label="Date"
        />
        <FormField
          {...registerWithErrors("day")}
          label="Day"
        />
        <FormField
          {...registerWithErrors("isAtHome")}
          label="Is at home"
        />
        <FormField
          {...registerWithErrors("opponent")}
          label="Opponent"
        />
        <FormField
          {...registerWithErrors("team")}
          label="Team"
        />
        <FormField
          {...registerWithErrors("venue")}
          label="Venue"
        />
        <Button type="submit" className="mt-4">
          Save
        </Button>
      </form>
    </div>
  );
};
