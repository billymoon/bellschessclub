"use client";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Match, MatchPartial, Member } from "@/modules/schema";
import { useForm } from "react-hook-form";
import { create } from "superstruct";
import { FormFieldSelect } from "@/components/FormFieldSelect";
import { cn } from "@/lib/utils";
import { createMatchDocument, updateMatchDocument } from "@/modules/turso";
import { ComboboxBasic } from "@/components/ComboboxBasic";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const EditPage = ({ currentDocument = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm({
    defaultValues: currentDocument
      ? currentDocument
      : {
          name: "",
        },
    resolver: async (schema: Member) => {
      const errors = {};
      try {
        const values = create(
          {
            ...schema,
            // username: schema.username || schema._id || "something" + Math.random().toString().slice(-5),
            // lichessUsername: schema.username || schema._id || "something" + Math.random().toString().slice(-5),
          },
          Member,
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
    setIsSubmitting(true);
    if (currentDocument) {
      await updateMatchDocument(values);
    } else {
      await createMatchDocument(values, "member");
    }
    router.push("/admin");
  };

  const registerWithErrors = (fieldName) => ({
    ...register(fieldName),
    defaultValue: defaultValues[fieldName],
    error: errors[fieldName]?.toString(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField {...registerWithErrors("name")} label="Name" />
        <Button
          type="submit"
          className="mt-4 cursor-pointer"
          disabled={isSubmitting}
        >
          Save
        </Button>
      </form>
    </div>
  );
};
